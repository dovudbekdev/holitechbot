const axios = require("axios")
const ShortUniqueId = require("short-unique-id")
const config = require("../../utils/config")
const ProjectModel = require("../../database/models/Project")

const { randomUUID } = new ShortUniqueId({ length: 10 })

exports.getall = async (req, res) => {
    try {
        const { page = 1, item = 10 } = req.query

        const totalProjects = await ProjectModel.countDocuments({
            active: true,
        })

        const projects = await ProjectModel.find({ active: true })
            .skip((page - 1) * item)
            .limit(parseInt(item))

        res.status(200).json({ ok: true, projects, total: totalProjects })
    } catch (error) {
        console.log("error getall", error)
        res.status(404).json({ ok: false, message: error + "" })
    }
}

exports.getByID = async (req, res) => {
    try {
        const project = await ProjectModel.findById({ _id: req.params.id })
        if (project) {
            res.status(200).json({ ok: true, project })
        } else {
            res.status(404).json({
                ok: true,
                message: "Project not undifayned",
            })
        }
    } catch (error) {
        console.log("error getByID", error)
        res.status(404).json({ ok: false, message: error + "" })
    }
}

exports.create = async (req, res) => {
    try {
        // Telegram botini kanalga admin yoki admin emasligini aniqlash uchun so'rov
        const response = await axios.post(
            `https://api.telegram.org/bot${config.BOT_TOKEN}/getChatMember`,
            {
                chat_id: req.body.channelId, // Kanal IDsi
                user_id: config.BOT_TOKEN.split(":")[0], // Bot IDsi (Bot tokenidan olish mumkin)
            }
        )

        // Botning administrator ekanligini tekshirish
        const isAdmin =
            response.data.result.status === "administrator" ||
            response.data.result.status === "creator"

        if (!isAdmin) {
            console.log("Bot administrator huquqlariga ega emas")

            return res
                .status(404)
                .json({ ok: false, message: "Bot kanalda admin huquqlariga ega emas" })
        }

        // Agar bot admin bo'lsa, keyingi qadamlarni bajarish
        const projectId = randomUUID()
        const data = new ProjectModel({
            ...req.body,
            projectId,
            botLink: `https://t.me/${config.BOT_USERNAME}?start=${projectId}`,
        })

        await data.save()

        res.status(200).json({ ok: true, data })
    } catch (error) {
        console.log("Error create", error.message || error)
        res.status(404).json({ ok: false, message: error.message || "Xatolik yuz berdi" })
    }
}


exports.updateById = async (req, res) => {
    try {
        const result = await ProjectModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })

        if (!result) {
            return res.status(404).json({ ok: false, message: "Project not found" })
        }

        res.status(200).json({ ok: true, result })
    } catch (error) {
        console.error("Error in updateById:", error)

        res.status(404).json({ ok: false, message: error + "" })
    }
}

exports.deleteById = async (req, res) => {
    try {
        await ProjectModel.findByIdAndUpdate(req.params.id, { active: false })

        res.status(200).json({ ok: true, data: "removed molodec" })
    } catch (error) {
        console.log("error deleteById", error)
        res.status(404).json({ ok: false, message: error + "" })
    }
}
