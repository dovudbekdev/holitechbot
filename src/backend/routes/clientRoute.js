const express = require("express")
const { getall, updateById, login } = require("../controllers/clientController")
const checkAuthMenejer = require("../middlewares/auth")
const router = express.Router()

router.get("/", getall)
router.put("/:id", checkAuthMenejer, updateById)
router.post("/login", login)

module.exports = {
    path: "/menejer",
    router,
}
