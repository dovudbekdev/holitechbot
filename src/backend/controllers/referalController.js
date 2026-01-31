const InviteModel = require("../../database/models/Invite")

exports.getall = async (req, res) => {
    try {
        const { page = 1, item = 10 } = req.query

        const totalInvitess = await InviteModel.countDocuments({
            active: true,
        })

        const invites = await InviteModel.find({ active: true })
            .select("-password")
            .skip((page - 1) * item)
            .limit(parseInt(item))

        res.status(200).json({ ok: true, invites, total: totalInvitess })
    } catch (error) {
        console.error("Error in getAllMenejers:", error)
        res.status(404).json({ ok: false, message: error.message })
    }
}

exports.getByID = async (req, res) => {
    try {
        const invite = await InviteModel.findById({
            _id: req.params.id,
        })

        if (invite) {
            res.status(200).json({ ok: true, invite })
        } else {
            res.status(404).json({ ok: true, message: "invite not undifayned" })
        }
    } catch (error) {
        console.error("Error in getInviteById:", error)
        res.status(404).json({ ok: false, message: error.message })
    }
}

exports.create = async (req, res) => {
    try {
        const data = new InviteModel(req.body)

        await data.save()

        res.status(200).json({ ok: true, data })
    } catch (error) {
        console.error("Error in createInvite:", error)
        res.status(404).json({ ok: false, message: error.message })
    }
}

exports.updateById = async (req, res) => {
    try {
        const invite = await InviteModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        )

        if (!invite) {
            return res
                .status(404)
                .json({ ok: false, message: "invite not found" })
        }

        res.status(200).json({ ok: true, result: invite })
    } catch (error) {
        console.error("Error in updateinviteById:", error)
        res.status(404).json({ ok: false, message: error.message })
    }
}

exports.deleteById = async (req, res) => {
    try {
        const invite = await InviteModel.findByIdAndUpdate(req.params.id, {
            active: false,
        })

        if (!invite) {
            return res
                .status(404)
                .json({ ok: false, message: "Menejer not found" })
        }

        res.status(200).json({
            ok: true,
            data: "invite removed successfully",
        })
    } catch (error) {
        console.error("Error in deleteinviteById:", error)
        res.status(404).json({ ok: false, message: error.message })
    }
}
