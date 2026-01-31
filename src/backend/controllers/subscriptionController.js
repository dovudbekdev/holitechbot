const User = require("../../database/models/User")
const Subscription = require("../../database/models/Subscription")
const Project = require("../../database/models/Project")

exports.getall = async (req, res) => {
    try {
        const { page = 1, item = 10, filter = "all" } = req.query

        const endTime = new Date().getTime()
        let query = { active: true }

        if (filter === "debtors") {
            query = {
                active: true,
                monthly: true,
                nextPaymentDate: { $lte: endTime },
            }
        } else if (filter === "full") {
            query = {
                active: true,
                monthly: true,
                nextPaymentDate: { $gte: endTime },
            }
        } else if (filter === "all") {
            query = { active: true }
        }

        const total = await Subscription.countDocuments(query)

        const subscriptions = await Subscription.find(query)
            .skip((page - 1) * item)
            .limit(parseInt(item))

        const userIds = subscriptions.map((sub) => sub.userId)
        const projectIds = subscriptions.map((sub) => sub.projectId)

        const [users, projects] = await Promise.all([
            User.find({ userId: { $in: userIds } }).lean(),
            Project.find({ projectId: { $in: projectIds } }).lean(),
        ])

        const subscriptionsWithUserDetails = subscriptions.map(
            (subscription) => {
                const user = users.find(
                    (user) => user.userId === subscription.userId
                )
                const project = projects.find(
                    (project) => project.projectId === subscription.projectId
                )

                return {
                    ...subscription.toObject(),
                    user: user || null,
                    project: project || null,
                }
            }
        )

        res.status(200).json({
            ok: true,
            subscriptions: subscriptionsWithUserDetails,
            total,
        })
    } catch (error) {
        console.log("error getall", error)
        res.status(404).json({ ok: false, message: error.toString() })
    }
}

exports.updateById = async (req, res, next) => {
    try {
        const result = await Subscription.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        if (!result) {
            return res
                .status(404)
                .json({ ok: false, message: "Subscription not found" })
        }

        res.status(200).json({ ok: true, result })
    } catch (error) {
        console.log("error updateById", error)
        next(error)
    }
}
