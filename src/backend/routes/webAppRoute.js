const {
    cardPost,
    subscription,
    smsCheck,
    close,
} = require("../controllers/webAppController");

const express = require("express");
const router = express.Router();

router.post("/subscription", subscription);
router.post("/card-add", cardPost);
router.post("/confirm-code", smsCheck);
router.post("/close", close);

module.exports = {
    path: "/",
    router,
};
