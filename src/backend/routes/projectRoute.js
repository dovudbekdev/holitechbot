const express = require("express")
const router = express.Router()

const ProjectCtrl = require("../controllers/projectController")

router.get("/", ProjectCtrl.getall)
router.get("/:id", ProjectCtrl.getByID)
router.post("/", ProjectCtrl.create)
router.put("/:id", ProjectCtrl.updateById)
router.delete("/:id", ProjectCtrl.deleteById)

module.exports = {
    path: "/projects",
    router,
}
