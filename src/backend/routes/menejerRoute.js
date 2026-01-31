const express = require("express")
const router = express.Router()

const MenejerCtrl = require("../controllers/menejerController")

router.get("/", MenejerCtrl.getall)
router.get("/:id", MenejerCtrl.getByID)
router.post("/", MenejerCtrl.create)
router.put("/:id", MenejerCtrl.updateById)
router.delete("/:id", MenejerCtrl.deleteById)
router.delete("/all", MenejerCtrl.deleteAll)

module.exports = {
    path: "/menejers",
    router,
}
