const { Telegraf } = require("telegraf")
const winston = require("winston")
const { combine, timestamp, json, prettyPrint, errors } = winston.format
const { Logtail } = require("@logtail/node")
const { LogtailTransport } = require("@logtail/winston")

const path = require("path")

require("dotenv").config({
    path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`),
})

const bot = new Telegraf(process.env.LOG_BOT_TOKEN)
const logChatId = process.env.ADMIN_ID

const sendLogToTelegram = async (level, message) => {
    try {
        await bot.telegram.sendMessage(logChatId, `${level.toUpperCase()}: ${message}`)
    } catch (err) {
        console.error("Error sending log to Telegram:", err)
    }
}

bot.launch()

const LOG_TOKEN = "62RR7EYRWXn5sHFTxEhupGnn"

const logtail = new Logtail(LOG_TOKEN)

const logger = winston.createLogger({
    level: "info",
    format: combine(errors({ stack: true }), timestamp(), json(), prettyPrint()),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        }),
        new LogtailTransport(logtail),
    ],
})
 
// const logAndNotify = {
//     info: async (message) => {
//         await sendLogToTelegram("info", message)
//         logger.info(message)
//     },
//     error: async (message) => {
//         await sendLogToTelegram("error", message)
//         logger.error(message)
//     },
// }

module.exports = logger
