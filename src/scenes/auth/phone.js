const { Scenes, Markup } = require("telegraf");
const db = require("../../database");

const scene = new Scenes.BaseScene("phone");

scene.enter(async (ctx) => {
  await ctx.reply(
    "Telefon raqamingizni kiriting: ",
    Markup.keyboard([
      Markup.button.contactRequest("📱 Telefon raqamni yuborish"),
    ])
      .resize()
      .oneTime()
  );
});

scene.hears(/^\/start\b/, (ctx) => ctx.scene.enter("start"));

scene.on("contact", async (ctx) => {
  try {
    const userId = ctx.from.id;
    let phoneNumber = ctx.message?.contact.phone_number;

    await db.controllers.users.updateUser(userId, {
      phoneNumber: phoneNumber,
    });

    await ctx.reply("Ma'lumotlaringiz muvaffaqiyatli saqlandi. Rahmat!");

    return await ctx.scene.enter("start");
  } catch (e) {
    console.log("phone.js: " + e);
  }
});

scene.on("text", async (ctx) => {
  try {
    await ctx.reply(
      "Iltimos, telefon raqamingizni tugma orqali yuboring: ",
      Markup.keyboard([
        Markup.button.contactRequest("📱 Telefon raqamni yuborish"),
      ])
        .resize()
        .oneTime()
    );
  } catch (e) {
    console.log("phone.js: " + e);
  }
});

module.exports = scene;
