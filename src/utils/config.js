const path = require("path");
const logger = require("./logger");

require("dotenv").config({
  path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`),
});

const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  BOT_TOKEN: process.env.BOT_TOKEN,
  BOT_USERNAME: process.env.BOT_USERNAME,
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  URL: process.env.URL,
  ADMIN_URL: process.env.ADMIN_URL,
  BACKEND_API: process.env.BACKEND_API,
  BACKEND_TOKEN: process.env.BACKEND_TOKEN,
  ADMIN_ID: process.env.ADMIN_ID,
  LOG_BOT_TOKEN: process.env.LOG_BOT_TOKEN,
  ADS_CHANNEL: process.env.ADS_CHANNEL,
  CHANNEL_NAME: process.env.CHANNEL_NAME,
  HOLITECH_URL: process.env.HOLITECH_URL,
};

module.exports = config;
