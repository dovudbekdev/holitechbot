const { Scenes, Markup } = require("telegraf");
const db = require("../../database");

const scene = new Scenes.BaseScene("last-name-settings");

scene.enter(async (ctx) => {
    let keyboard = Markup.keyboard([["⬅️ Ortga"]]).resize();

    await ctx.reply("Familiyani yangilash", keyboard);
});

scene.hears("⬅️ Ortga", (ctx) => ctx.scene.enter("start"));

scene.on("text", async (ctx) => {
    try {
        const userId = ctx.from.id;
        let text = ctx.message?.text;

        await db.controllers.users.updateUser(userId, {
            lastName: text,
        });

        await ctx.reply("Familiya yangilandi");

        return ctx.scene.enter("settings");
    } catch (e) {
        console.log("settings/firstName.js: " + e);
    }
});

scene.hears(/^\/start\b/, (ctx) => ctx.scene.enter("start"));
scene.hears("⬅️ Ortga", (ctx) => ctx.scene.enter("settings"));

module.exports = scene;
