const express = require("express")
const {
    getall,
    updateById,
} = require("../controllers/subscriptionController")
const router = express.Router()

router.get("/", getall)
router.put("/:id", updateById)

module.exports = {
    path: "/users",
    router,
}
