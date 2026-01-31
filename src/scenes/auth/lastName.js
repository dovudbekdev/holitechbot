const { Scenes } = require("telegraf");
const db = require("../../database");

const scene = new Scenes.BaseScene("last-name");

scene.enter(async (ctx) => {
  await ctx.reply("Familiyangizni kiriting: ");
});

scene.hears(/^\/start\b/, (ctx) => ctx.scene.enter("start"));

scene.on("text", async (ctx) => {
  try {
    const userId = ctx.from.id;
    let text = ctx.message?.text;

    await db.controllers.users.updateUser(userId, {
      lastName: text,
    });

    return ctx.scene.enter("phone");
  } catch (e) {
    console.log("lastName.js: " + e);
  }
});

module.exports = scene;
