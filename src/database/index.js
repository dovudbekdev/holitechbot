const mongoose = require("mongoose");
const config = require("../utils/config");
const logger = require("../utils/logger");

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(config.MONGO_URL);
        logger.info(`MONGODB CONNECT ${config.MONGO_URL}`);
    } catch (e) {
        console.log(e);
        logger.error(e + "");
        process.exit();
    }
};
connectDB();

const db = {
    controllers: require("./controllers"),
    models: require("./models"),
};

module.exports = db;
