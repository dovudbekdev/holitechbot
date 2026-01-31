const { Markup } = require("telegraf");
const config = require("../../utils/config");

// module.exports = async (ctx) => {
//   try {
//     let txt = `Assalomu Alaykum!

// Tashrif buyurganingiz uchun rahmat.

// Loyiha haqida “( ${config.CHANNEL_NAME} )” kanali orqali batafsil malumot olishingiz mumkin.`;

//     let keyboard = Markup.keyboard([
//       ["🛒 Obunalar", "📮 To'lovlar tarixi"],
//       ["⁉️ Yordam", "⚙️ Sozlamalar"],
//       ["🤝 Hamkorlik qilish"],
//     ]).resize();

//     keyboard.caption = txt;
//     await ctx.reply(txt, keyboard);
//   } catch (e) {
//     console.log("menu.js: " + e);
//   }
// };

// module.exports = async (ctx) => {
//   try {
//     let txt = `*Yopiq Kanaldan Nimalar O'rganasiz?*

// 1. *YouTube kanalini yaratish va yuritish* – Kanalingizni to‘g‘ri yo‘lga qo‘yish va uni muvaffaqiyatli boshqarish bo‘yicha tayyor kurslar.

// 2. *Har oylik kontent chellenjlari* – Kanalni rivojlantirish uchun maxsus tayyorlangan vazifalar va chellenjlar.

// 3. *Jonli efirda savol-javoblar* – YouTube algoritmlari, monetizatsiya va auditoriyani jalb qilish bo‘yicha jonli sessiyalar.

// 4. *Hech qayerga qo‘yilmaydigan eksklyuziv darslar* – Faqat kanal a’zolari uchun maxsus olingan foydali video darsliklar.

// 5. *Muvaffaqiyatli YouTuberlar bilan jonli efirlar* – Tajribali kontent yaratuvchilarning maslahatlari va tavsiyalari.

// 6. *Kuchli jamoa* – YouTube'da o‘z kanalini rivojlantirayotgan intizomli va faol insonlar jamiyati.

// 💡 *A’zolik orqali barcha maxsus materiallardan foydalaning!*
// 📌 _Istalgan vaqtda obunani bekor qilish imkoniyati mavjud._`;

//     let keyboard = Markup.inlineKeyboard([
//       [Markup.button.callback("Yopiq kanalga to'lov qilish", "pay_channel")],
//       [
//         Markup.button.callback(
//           "Yopiq kanal haqida batafsil ma'lumot",
//           "channel_info"
//         ),
//       ],
//       [Markup.button.url(`Bog'lanish`, `https://t.me/amirbekCEO`)],
//     ]).resize();
//     await ctx.replyWithMarkdown(txt, keyboard);
//   } catch (e) {
//     console.log("menu.js: " + e);
//   }
// };
module.exports = async (ctx) => {
  try {
    let txt = `*Yopiq Kanaldan Nimalar O'rganasiz?*

📌 *YouTube kanalini yaratish va yuritish* – To‘g‘ri yo‘lga qo‘yish va uni muvaffaqiyatli boshqarish bo‘yicha tayyor mini kurslar.  

📌 *Har oylik kontent chellenjlari* – Kanalni rivojlantirish uchun maxsus tayyorlangan vazifalar va chellenjlar. 

📌 *Jonli efirda savol-javoblar* – YouTube algoritmlari, monetizatsiya va auditoriyani jalb qilish bo‘yicha jonli sessiyalar.  

📌 *Eksklyuziv darslar* – Faqat kanal a’zolari uchun maxsus tayyorlangan video darsliklar.  

📌 *Muvaffaqiyatli YouTuberlar bilan jonli efirlar* – Tajribali kontent yaratuvchilarning maslahatlari va tavsiyalari.  

📌 *Kuchli jamoa* – YouTube'da o‘z kanalini rivojlantirayotgan intizomli va faol insonlar jamiyati.  
    
💡 *A’zolik orqali barcha maxsus materiallardan foydalaning!*  
📌 _Istalgan vaqtda obunani bekor qilish imkoniyati mavjud._`;

    // let keyboard = Markup.keyboard([
    //   ["💳 Yopiq kanalga to'lov qilish"],
    //   ["ℹ️ Yopiq kanal haqida ma'lumot"],
    //   [Markup.button.url("📩 Bog'lanish", "https://t.me/amirbekCEO")][
    //     ("🛒 Obunalar", "📮 To'lovlar tarixi")
    //   ],
    //   ["⁉️ Yordam", "⚙️ Sozlamalar"],
    //   ["🤝 Hamkorlik qilish"],
    // ]).resize();

    // // keyboard.caption = txt;
    // // await ctx.reply(txt, keyboard);
    // await ctx.replyWithMarkdown(txt, keyboard);
    let keyboard = Markup.keyboard([
      ["💳 Yopiq kanalga to'lov qilish"],
      ["ℹ️ Yopiq kanal haqida ma'lumot"],
      [
        Markup.button.url("📩 Bog'lanish", "https://t.me/amirbekCEO"),
        "⚙️ Sozlamalar",
      ],
    ]).resize();

    await ctx.replyWithMarkdown(txt, keyboard);
  } catch (e) {
    console.error("menu.js error:", e);
  }
};
// let keyboard = Markup.inlineKeyboard([
//   [Markup.button.callback("💳 Yopiq kanalga to'lov qilish", "pay_channel")],
//   [
//     Markup.button.callback(
//       "ℹ️ Yopiq kanal haqida ma'lumot",
//       "channel_info"
//     ),
//   ],
//   [Markup.button.url("📩 Bog'lanish", "https://t.me/amirbekCEO")],
// ]).resize();
// await ctx.deleteMessage().catch(() => {});

// await ctx.replyWithMarkdown(txt, keyboard);
