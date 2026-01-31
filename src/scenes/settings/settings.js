const { Scenes, Markup } = require("telegraf");
const db = require("../../database");
const config = require("../../utils/config");

const scene = new Scenes.BaseScene("settings");

scene.enter(async (ctx) => {
  try {
    const userId = ctx.from.id;

    let user = await db.controllers.users.getByUserId(userId);

    let txt = `⚙️ Sozlamalar:

💬 Ism: ${user.firstName} 
💬 Familiya: ${user.lastName}
☎️ Telefon: ***${user.phoneNumber.slice(-4)}

💳 Karta: ${user.verifyCard ? "Tasdiqlangan ✅" : "Tasdiqlanmagan ❌"}`;

    let keyboard;

    if (user.verifyCard) {
      // Agar karta tasdiqlangan bo'lsa, o'chirish tugmasini ko'rsatamiz
      keyboard = Markup.keyboard([
        ["🗑️ Karta o'chirish"],
        ["💬 Ismni yanglash", "💬 Familiyani yangilash"],
        ["⬅️ Ortga"],
      ])
        .resize()
        .oneTime();
    } else {
      // Agar karta tasdiqlanmagan bo'lsa, qo'shish tugmasini ko'rsatamiz
      keyboard = Markup.keyboard([
        [
          Markup.button.webApp(
            "💳 Karta qo'shish",
            `${config.URL}/card-add.html?user_id=${userId}`
          ),
        ],
        ["💬 Ismni yanglash", "💬 Familiyani yangilash"],
        ["⬅️ Ortga"],
      ])
        .resize()
        .oneTime();
    }

    await ctx.reply(txt, keyboard);
  } catch (e) {
    console.log("settings.js: " + e);
  }
});

scene.hears(/^\/start\b/, (ctx) => ctx.scene.enter("start"));
scene.hears("⬅️ Ortga", (ctx) => ctx.scene.enter("start"));

// Kartani o'chirish tasdiqlash
scene.hears("🗑️ Karta o'chirish", async (ctx) => {
  try {
    const userId = ctx.from.id;

    // Tasdiqlash uchun tugma
    const confirmKeyboard = Markup.inlineKeyboard([
      [Markup.button.callback("✅ Tasdiqlash", `confirm_delete_${userId}`)],
      [Markup.button.callback("❌ Bekor qilish", "cancel_delete")],
    ]);

    await ctx.reply(
      "Sizning kartangizni o'chirmoqchimisiz? Iltimos, tasdiqlang yoki bekor qiling.",
      confirmKeyboard
    );
  } catch (e) {
    await ctx.reply(
      "Karta o'chirish jarayonida xato yuz berdi. Iltimos, qaytadan urinib ko'ring."
    );
  }
});

// Tasdiqlash yoki bekor qilish
scene.action(/confirm_delete_(\d+)/, async (ctx) => {
  try {
    const userId = ctx.match[1];

    await db.controllers.users.deleteCard(userId);

    await ctx.deleteMessage();

    const keyboard = Markup.keyboard([
      [
        Markup.button.webApp(
          "💳 Karta qo'shish",
          `${config.URL}/card-add.html?user_id=${userId}`
        ),
      ],
      ["💬 Ismni yanglash", "💬 Familiyani yangilash"],
      ["⬅️ Ortga"],
    ]).resize();

    await ctx.reply("Sizning kartangiz muvaffaqiyatli o'chirildi.", keyboard);
  } catch (e) {
    await ctx.reply(
      "Karta o'chirish jarayonida xato yuz berdi. Iltimos, qaytadan urinib ko'ring."
    );
  }
});

// Bekor qilish
scene.action("cancel_delete", async (ctx) => {
  await ctx.editMessageText("Karta o'chirish bekor qilindi.");
});

scene.hears("💬 Ismni yanglash", (ctx) =>
  ctx.scene.enter("first-name-settings")
);
scene.hears("💬 Familiyani yangilash", (ctx) =>
  ctx.scene.enter("last-name-settings")
);

module.exports = scene;
