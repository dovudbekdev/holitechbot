const { Scenes, Markup } = require("telegraf");
const Path = require("path");
const db = require("../../database");
const sendProjectInfo = require("./sendProjectInfo");
const menu = require("./menu");
const formatDate = require("../../utils/formatDate");
const config = require("../../utils/config");
const logger = require("../../utils/logger");

const scene = new Scenes.BaseScene("start");

// Foydalanuvchi ma'lumotlarini tekshirish va sahifalarga yo'naltirish
scene.enter(async (ctx) => {
  try {
    const userId = ctx.from.id;
    const user = await db.controllers.users.getByUserId(userId);
    const project = await db.controllers.projects.getProject();

    let refId = ctx.message?.text?.split(" ")[1];

    if (refId) {
      const meneger = await db.controllers.menegers.findMenegerByRefId(refId);
      // if (meneger) {
      //   await db.controllers.invites.create({
      //     userId,
      //     projectId: project.projectId,
      //     refId,
      //   });
      // }

      if (meneger) {
        const existingInvite = await db.controllers.invites.findOne({
          userId,
          projectId: project.projectId,
        });

        // Foydalanuvchi hali invite qilinmagan yoki to'lov qilmagan
        if (!existingInvite || existingInvite.isPaid !== true) {
          await db.controllers.invites.create({
            userId,
            projectId: project.projectId,
            refId,
          });
        }

        // Foydalanuvchi to'lov qilgan, lekin refId yo'q — yangilaymiz
        if (existingInvite?.isPaid === true && !existingInvite.refId) {
          await db.controllers.invites.updateInvite(userId, project.projectId, {
            refId,
          });
        }
      }
    }

    if (!user || !user.firstName || !user.lastName || !user.phoneNumber) {
      await db.controllers.users.updateUser(userId, {
        projectId: null,
      });
      return await ctx.scene.enter("first-name");
    }

    await menu(ctx);
  } catch (e) {
    console.error("start/index.js enter error:", e);
  }
});

// To'lov qilish sahifasi
scene.hears("💳 Yopiq kanalga to'lov qilish", async (ctx) => {
  try {
    let txt = `📄 *Toʻlov qilish uchun Ommaviy oferta shartlariga rozilik bildirishingiz kerak!*
  
  📝 *Oferta*: [Havola](https://docs.google.com/document/d/1yO1ZcpY1ewqyD_oCEpA6ebQ-IUKToAfg3NuLdZN67QQ/edit?usp=sharing)`;

    let keyboard = Markup.keyboard([["✅ Roziman"], ["🔙 Orqaga"]]).resize();

    await ctx.replyWithMarkdown(txt, keyboard);
  } catch (e) {
    console.error("ERROR: Yopiq kanalga to'lov qilish:", e);
  }
});

// Yopiq kanal haqida ma'lumot
scene.hears("ℹ️ Yopiq kanal haqida ma'lumot", async (ctx) => {
  try {
    let txt = `📢 *Assalomu Alaykum!*  
  
  Tashrif buyurganingiz uchun rahmat.  
  
  Ushbu kanalda quyidagi mavzularda foydali materiallar va darsliklar taqdim etiladi:
  
  1️⃣ **Youtube psixologiyasi**  

  2️⃣ **Yo’nalishlar**  

  3️⃣ **Sun’iy intellekt**  

  4️⃣ **Har oylik chellenjlar va vazifalar**  

  5️⃣ **Jonli efirda savollarga javoblar**  

  6️⃣ **Eksklyuziv videolar** 

  7️⃣ **Muvaffaqiyatli insonlar bilan jonli efirlar**`;

    let keyboard = Markup.keyboard([["📩 Bog'lanish"], ["🔙 Orqaga"]]).resize();

    await ctx.replyWithMarkdown(txt, keyboard);
  } catch (e) {
    console.error("ERROR: Yopiq kanal haqida ma'lumot:", e);
  }
});

scene.hears("✅ Roziman", async (ctx) => {
  try {
    const project = await db.controllers.projects.getProject();
    if (!project || !project.projectId) {
      return ctx.scene.enter("start");
    }

    let txt = `💳 *Yopiq kanalga obuna bo‘lish narxi:*  
  
📅 *1-oylik – 1000 so‘m* 

Keyingi oydan 47 000 so'mdan yechadi har oyda 1 marta, agar xohlamasangiz bot orqali obunani bekor qilishingiz mumkin.
  
📌 *To‘lov qilingandan so‘ng har 30 kun ichida obuna uchun to‘lovi avtomatik tarzda yechiladi. To‘lovni vaqtida qilmagan ishtirokchi kanaldan chiqarib yuboriladi.*  
  
👇 *To‘lov qilish* 👇`;

    const userId = ctx.from.id;
    // let url = `${config.URL}?project_id=67af32a0333bc368c6791e3c&user_id=${userId}`;
    const defaultDuration =
      project.prices.length > 0 ? project.prices[0].duration : 1;

    // Loglar faqat foydalanuvchi "✅ Roziman" bosganda chiqadi
    logger.info(
      `Roziman: projectId=${project?.projectId} defaultDuration=${defaultDuration} userId=${userId} config.URL=${config.URL}`,
    );

    let url = `${config.URL}?project_id=${project.projectId}&user_id=${userId}&duration=${defaultDuration}`;

    let keyboard = Markup.keyboard([
      [Markup.button.webApp("💳 Uzcard/Humo to‘lov qilish", url)],
      ["🔙 Orqaga"],
    ]).resize();

    await ctx.replyWithMarkdown(txt, keyboard);
  } catch (e) {
    console.error("accept_offer action error:", e);
  }
});

scene.hears("🔙 Orqaga", (ctx) => ctx.scene.enter("start"));

scene.hears("📩 Bog'lanish", async (ctx) => {
  try {
    let txt = `👨‍💻 *Admin bilan bog'lanish uchun quyidagi ma'lumotlardan foydalaning:*
  
    📞 *Telegram:* [Admin](https://t.me/holitech_admin1)`;

    let keyboard = Markup.keyboard([["🔙 Orqaga"]]).resize();

    await ctx.replyWithMarkdown(txt, keyboard);
  } catch (e) {
    console.error("start/index.js pay_channel error:", e);
  }
});

scene.hears("⚙️ Sozlamalar", async (ctx) => {
  try {
    console.log("Sozlamalarga kirdi");
    const userId = ctx.from.id;

    let user = await db.controllers.users.getByUserId(userId);
    const project = await db.controllers.projects.getProject();
    const subscriptionId =
      await db.controllers.subscriptions.getSubscriptionByUserIdAndProjectId(
        userId,
        project.projectId,
      );

    let txt = `⚙️ Sozlamalar:

💬 Ism: ${user.firstName} 
💬 Familiya: ${user.lastName}
☎️ Telefon: ***${user.phoneNumber.slice(-4)}

💳 Karta: ${user.verifyCard ? "Tasdiqlangan ✅" : "Tasdiqlanmagan ❌"}
ℹ️ Obuna: ${
      subscriptionId && subscriptionId.active ? "Mavjud ✅" : "Mavjud emas ❌"
    }

`;

    // // let keyboard;

    // if (subscriptionId && subscriptionId.active) {
    //   // Agar karta tasdiqlangan bo'lsa, o'chirish tugmasini ko'rsatamiz
    //   keyboard = Markup.keyboard([["🗑️ Obunani o'chirish"], ["🔙 Orqaga"]])
    //     .resize()
    //     .oneTime();
    // } else {
    //   // Agar karta tasdiqlanmagan bo'lsa, qo'shish tugmasini ko'rsatamiz
    //   keyboard = Markup.keyboard([["🔙 Orqaga"]])
    //     .resize()
    //     .oneTime();
    // }

    // Keyboard yaratish
    let keyboardButtons = [];

    if (subscriptionId && subscriptionId.active) {
      keyboardButtons.push(["🗑️ Obunani o'chirish"]);
    }

    if (user.verifyCard) {
      keyboardButtons.push(["🗑️ Kartani o'chirish"]);
    }

    keyboardButtons.push(["🔙 Orqaga"]);

    const keyboard = Markup.keyboard(keyboardButtons).resize().oneTime();

    // Foydalanuvchiga javob qaytarish
    await ctx.reply(txt, keyboard);
  } catch (e) {
    console.log("settings: " + e);
  }
});

scene.hears("🗑️ Obunani o'chirish", async (ctx) => {
  try {
    const userId = ctx.from.id;
    // kartani o'chirish
    await db.controllers.users.deleteCard(userId);
    const project = await db.controllers.projects.getProject();
    if (!project || !project.projectId) {
      return ctx.scene.enter("start");
    }
    const subscriptionId =
      await db.controllers.subscriptions.getSubscriptionByUserIdAndProjectId(
        userId,
        project.projectId,
      );

    const updatedSubscription =
      await db.controllers.subscriptions.cancelSubscription(subscriptionId);

    if (!updatedSubscription) {
      await ctx.answerCbQuery("Obuna to'xtatilmadi");
      return;
    }
    await ctx.telegram.kickChatMember(project.channelId, userId);
    await ctx.telegram.unbanChatMember(project.channelId, userId);
    const keyboard = Markup.keyboard([["🔙 Orqaga"]]).resize();
    await ctx.reply("Obuna muvaffaqiyatli to'xtatildi.", keyboard);
  } catch (e) {
    await ctx.reply(
      "Karta o'chirish jarayonida xato yuz berdi. Iltimos, qaytadan urinib ko'ring.",
    );
  }
});

scene.hears("🗑️ Kartani o'chirish", async (ctx) => {
  try {
    const userId = ctx.from.id;
    // kartani o'chirish
    await db.controllers.users.deleteCard(userId);

    const keyboard = Markup.keyboard([["🔙 Orqaga"]]).resize();
    await ctx.reply("Sizning kartangiz muvaffaqiyatli o'chirildi.", keyboard);
  } catch (e) {
    await ctx.reply(
      "Karta o'chirish jarayonida xato yuz berdi. Iltimos, qaytadan urinib ko'ring.",
    );
  }
});

scene.hears("🗑️ O'chirish", async (ctx) => {
  try {
    const userId = ctx.from.id;

    await db.controllers.users.deleteCard(userId);

    await ctx.deleteMessage();

    const keyboard = Markup.keyboard([
      [
        Markup.button.webApp(
          "💳 Karta qo'shish",
          `${config.URL}/card-add.html?user_id=${userId}`,
        ),
      ],
      ["💬 Ismni yanglash", "💬 Familiyani yangilash"],
      ["⬅️ Ortga"],
    ]).resize();

    await ctx.reply("Sizning kartangiz muvaffaqiyatli o'chirildi.", keyboard);
  } catch (e) {
    await ctx.reply(
      "Karta o'chirish jarayonida xato yuz berdi. Iltimos, qaytadan urinib ko'ring.",
    );
  }
});

scene.action("close", async (ctx) => {
  try {
    await ctx.answerCbQuery("Xabar yopildi.");
    await ctx.deleteMessage(); // Eski xabarni o'chirish
  } catch (e) {
    console.log(e);
  }
});
// scene.enter(async (ctx) => {
//     try {
//         const userId = ctx.from.id

//         const user = await db.controllers.users.getByUserId(userId)

//         let projectIdFromMessage = ctx.message?.text?.split(" ")[1]

//         let projectId, refId

//         if (projectIdFromMessage) {
//             const parts = projectIdFromMessage.split("-")
//             projectId = parts[0] // Birinchi qism - projectId
//             refId = parts[1] || null // Ikkinchi qism - refId (yo'q bo'lsa, null)

//             if (refId)
//                 await db.controllers.invites.create({
//                     userId,
//                     projectId,
//                     refId,
//                 })
//         }

//         let project

//         if (!user || !user.firstName || !user.lastName || !user.phoneNumber) {
//             await db.controllers.users.updateUser(userId, {
//                 projectId,
//             })

//             return await ctx.scene.enter("first-name")
//         }

//         // Agar /start projectId bilan projectni topadi
//         if (projectId) {
//             project = await db.controllers.projects.getProjectById(projectId)
//         }

//         // agar projectId yo'q bo'lsa yoki user authga yo'naltirilgan bo'lsa usersdan projectId orqali projectni oladi
//         if (!project && user.projectId) {
//             project = await db.controllers.projects.getProjectById(user.projectId)

//             await db.controllers.users.updateUser(userId, {
//                 projectId: null,
//             })
//         }

//         if (project) {
//             await sendProjectInfo(ctx, project)
//         } else {
//             await menu(ctx)
//         }
//     } catch (e) {
//         console.log("start/index.js " + e)
//     }
// })

// Yordam
// scene.hears("⁉️ Yordam", async (ctx) => {
//   try {
//     let txt = `Agar sizda xizmatdan foydalanish bilan bog’liq savollar bo’lsa, quyidagi ma’lumotlar bilan tanishib chiqishingizni so’raymiz.

// Aloqa: @amirbekCEO`;

//     let keyboard = Markup.inlineKeyboard([
//       [
//         Markup.button.url(
//           "Ko'p takrorlanadigan savollar",
//           "https://telegra.ph/Kop-soraladigan-savollar-08-23"
//         ),
//       ],
//     ]).resize();

//     keyboard.caption = txt;
//     await ctx.replyWithPhoto(
//       "https://res.cloudinary.com/drqsvaf78/image/upload/v1724411596/p6gjcbvinazms3ic2pz2.png",
//       keyboard
//     );
//   } catch (e) {
//     console.log(e);
//   }
// });

// Hamkorlik
// scene.hears("🤝 Hamkorlik qilish", async (ctx) => {
//   try {
//     let txt = `Agar sizda maqsadli auditoriya va unda sotuvlar bilan ishlasangiz bizning xizmat aynan siz uchun.

// Formani to'ldiring: https://forms.gle/YSvxYppP2PcWixPG9\n@amirbekCEO
// yoki
// Pastdagi 🖌 Bog'lanish tugmasini tanlang`;

//     let keyboard = Markup.inlineKeyboard([
//       [
//         Markup.button.url(
//           "Formani o'tish",
//           "https://forms.gle/YSvxYppP2PcWixPG9"
//         ),
//       ],
//       [Markup.button.url(`Bog'lanish`, `https://t.me/amirbekCEO`)],
//     ]).resize();

//     keyboard.caption = txt;
//     await ctx.replyWithPhoto(
//       "https://res.cloudinary.com/drqsvaf78/image/upload/v1724412104/b32i310wavqszuxm0qen.png",
//       keyboard
//     );
//   } catch (e) {
//     console.log(e);
//   }
// });

// scene.hears("🛒 Obunalar", async (ctx) => {
//   try {
//     const userId = ctx.from.id; // User ID'si
//     const subscriptions =
//       await db.controllers.subscriptions.getSubscriptionsByUserId(userId);

//     if (subscriptions.length === 0) {
//       await ctx.reply("Sizda hech qanday obuna yo'q.");
//       return;
//     }

//     // Har bir obuna uchun tegishli loyihani olib kelish
//     const subscriptionMessages = await Promise.all(
//       subscriptions.map(async (sub, index) => {
//         const project = await db.controllers.projects.getProjectById(
//           sub.projectId
//         );
//         return {
//           text: `${index + 1}. ${project?.channelName}`,
//           callback_data: `subscribe_${sub._id}`,
//         };
//       })
//     );

//     const keyboard = subscriptionMessages.map((sub) => [
//       Markup.button.callback(sub.text, sub.callback_data),
//     ]);

//     await ctx.reply("Sizning obunalaringiz:", Markup.inlineKeyboard(keyboard));
//   } catch (e) {
//     console.log(e);
//   }
// });

// scene.hears("📮 To'lovlar tarixi", async (ctx) => {
//   try {
//     const userId = ctx.from.id;

//     const paymentHistories =
//       await db.controllers.payments.getPaymentHistoriesByUser(userId);

//     if (paymentHistories.length === 0) {
//       await ctx.reply("Sizda hali to'lovlar tarixi yo'q.");
//       return;
//     }

//     const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//     await ctx.reply("To'lovlar tarixi: ");
//     for (const payment of paymentHistories) {
//       const project = await db.controllers.projects.getProjectById(
//         payment.projectId
//       );

//       const message = `To'lov:\n\nNomi: ${
//         project.channelName
//       }\nSana: ${new Date(payment.paymentDate).toLocaleString()}\nMiqdor: ${
//         payment.amount
//       } so'm\nInvoice ID: ${payment.invoiceId}\nNechi oyga: ${
//         payment.month
//       } oy`;
//       await ctx.reply(message);

//       await delay(1000);
//     }
//   } catch (e) {
//     console.log(e);
//     await ctx.reply("To'lovlar tarixini olishda xatolik yuz berdi.");
//   }
// });

// scene.action(/subscribe_/, async (ctx) => {
//   try {
//     const callbackData = ctx.callbackQuery.data;
//     const subscriptionId = callbackData.split("_")[1]; // `subscribe_` keyin kelgan qism obuna ID bo'ladi

//     // Obuna ma'lumotlarini olish
//     const subscription = await db.controllers.subscriptions.getSubscriptionById(
//       subscriptionId
//     );
//     if (!subscription) {
//       await ctx.answerCbQuery("Obuna topilmadi");
//       return;
//     }

//     const project = await db.controllers.projects.getProjectById(
//       subscription.projectId
//     );
//     if (!project) {
//       await ctx.answerCbQuery("Loyiha topilmadi");
//       return;
//     }

//     const subscriptionInfo = `
// Obuna ma'lumotlari:
// - Nomi: ${project.channelName}
// - To'lov: ${project.prices[0].price} so'm
// - Oylik: ${project.monthly ? "Ha" : "Yo'q"}
// - Obuna vaqti: ${formatDate(subscription.subscribedAt)}
// - Keyingi to'lov sanasi: ${formatDate(subscription.nextPaymentDate)}
// - Holati: ${subscription.active ? "Faol" : "Nofaol"}
// `;

//     const unsubscribeButton = Markup.button.callback(
//       "Obunani to'xtatish ❌",
//       `deletesub_${subscription._id.toString()}`
//     );
//     const closeButton = Markup.button.callback("Yopish ✅", "close");
//     const keyboard = Markup.inlineKeyboard([unsubscribeButton, closeButton]);

//     // Eski tugmani yangilash
//     await ctx.editMessageText(subscriptionInfo, keyboard);
//     await ctx.answerCbQuery(); // callbackni yopish
//   } catch (e) {
//     console.log("subscribe_", e);
//     await ctx.answerCbQuery("Xatolik yuz berdi");
//   }
// });

// scene.action(/deletesub_/, async (ctx) => {
//   try {
//     const callbackData = ctx.callbackQuery.data;
//     const subscriptionId = callbackData.split("_")[1]; // `unsubscribe_` keyin kelgan qism obuna ID bo'ladi
//     const userId = ctx.from.id;

//     // Obunani to'xtatish
//     const updatedSubscription =
//       await db.controllers.subscriptions.cancelSubscription(subscriptionId);

//     if (!updatedSubscription) {
//       await ctx.answerCbQuery("Obuna to'xtatilmadi");
//       return;
//     }

//     const project = await db.controllers.projects.getProjectById(
//       updatedSubscription.projectId
//     );
//     if (!project) {
//       await ctx.answerCbQuery("Loyiha topilmadi");
//       return;
//     }

//     // await ctx.telegram.kickChatMember(project.channelId, userId)
//     await ctx.telegram.unbanChatMember(project.channelId, userId);

//     const unsubscribeMessage = "Obuna muvaffaqiyatli to'xtatildi.";

//     // Tugmani yangilash
//     const keyboard = Markup.inlineKeyboard([
//       Markup.button.callback("Yopish", "close"),
//     ]);

//     // Xabarni yangilash
//     await ctx.editMessageText(unsubscribeMessage, {
//       reply_markup: keyboard.reply_markup,
//     });
//     await ctx.answerCbQuery(); // callbackni yopish
//   } catch (e) {
//     console.log("delete_sub", e);
//     await ctx.answerCbQuery("Xatolik yuz berdi");
//   }
// });

module.exports = scene;
