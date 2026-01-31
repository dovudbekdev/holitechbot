const config = require("./config");
const logger = require("./logger");

const startBot = (bot, botConfig = {}) => {
    bot.launch().then(() =>
        logger.info(`Bot @${bot.botInfo.username} started!`)
    );
    logger.info(`Bot @${config.BOT_USERNAME} started!`);
};

module.exports = startBot;
