const { Scenes } = require("telegraf");
const db = require("../../database");


const scene = new Scenes.BaseScene("check");

scene.enter(async (ctx) => {
  try {
    const userId = ctx.from.id;
    const user = await db.controllers.users.getByUserId(userId);

    if (!user || !user.subscription || user.subscription.status !== "active") {
      return ctx.reply(
        "❌ Sizning obunangiz faol emas. Iltimos, obuna bo‘ling."
      );
    }

    ctx.reply(
      `✅ Obunangiz faol.\n📅 Tugash sanasi: ${user.subscription.expiryDate}`
    );
  } catch (e) {
    console.log("check/index.js error:", e);
    ctx.reply("❌ Obunani tekshirishda xatolik yuz berdi.");
  }
});

module.exports = scene;
