const server = require("./src/backend/app")
const { bot } = require("./src/main")
const startBot = require("./src/utils/startBot")

server()       // Backend
startBot(bot)  // Bot
