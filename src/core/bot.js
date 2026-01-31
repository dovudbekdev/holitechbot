// const { Telegraf } = require('telegraf');
// const config = require('../utils/config');

// const bot = new Telegraf(config.BOT_TOKEN);

// module.exports = bot;

const { Telegraf, Scenes, session } = require("telegraf");
const config = require("../utils/config");
// const startScene = require("../scenes/start/start");
// const firstNameScene = require("../scenes/auth/firstName");
// const lastNameScene = require("../scenes/auth/lastName");
// const phoneScene = require("../scenes/auth/phone");
const bot = new Telegraf(config.BOT_TOKEN);

// Sahna menejeri
// const stage = new Scenes.Stage([
//   startScene,
//   firstNameScene,
//   lastNameScene,
//   phoneScene,
// ]);

// bot.use(session()); // Sessiyani yoqish
// bot.use(stage.middleware()); // Stage (sahnalar) ni ishlatish

// Bot buyruqlari
// bot.command("start", (ctx) => ctx.scene.enter("start"));
// bot.command("check", (ctx) => ctx.reply("Obunani tekshirish"));
// bot.command("cancel", (ctx) => ctx.reply("Obunani to‘xtatish"));

// // Buyruqlar menyusini o‘rnatish
// bot.telegram.setMyCommands([
//   { command: "start", description: "Botni qayta ishga tushirish" },
//   { command: "check", description: "Obunani tekshirish" },
//   { command: "cancel", description: "Obunani to‘xtatish" },
// ]);

bot.telegram.setMyDescription(
  "Assalomu alaykum. Bu bot orqali siz Yopiq kanalga qo‘shilishingiz mumkin.\n\nDavom etish uchun pastdagi tugmani bosing 👇"
);

module.exports = bot;
