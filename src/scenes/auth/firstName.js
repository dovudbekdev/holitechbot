const { Scenes } = require("telegraf");
const db = require("../../database");

const scene = new Scenes.BaseScene("first-name");

scene.enter(async (ctx) => {
  try {
    const userId = ctx.from.id;

    await db.controllers.users.updateUser(userId, {
      tgUserInfo: ctx.from,
    });

    await ctx.reply("Ismingizni kiriting:");
  } catch (e) {
    console.log("firstName: ", e);
  }
});

scene.hears(/^\/start\b/, (ctx) => ctx.scene.enter("start"));

scene.on("text", async (ctx) => {
  try {
    const userId = ctx.from.id;
    let text = ctx.message?.text;

    await db.controllers.users.updateUser(userId, {
      firstName: text,
    });

    return await ctx.scene.enter("last-name");
  } catch (e) {
    console.log("firstName.js: " + e);
  }
});

module.exports = scene;
