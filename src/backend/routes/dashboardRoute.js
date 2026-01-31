const express = require("express")
const router = express.Router()

const ProjectModel = require("../../database/models/Project")
const MenejerModel = require("../../database/models/Menejer")
const UserModel = require("../../database/models/User")
const PaymentModel = require("../../database/models/Payment")

router.get("/", async (req, res) => {
    try {
        const [totalProjects, totalMenejers, totalUsers, totalPayments] = await Promise.all([
            ProjectModel.countDocuments({ active: true }),
            MenejerModel.countDocuments({ active: true }),
            UserModel.countDocuments(),
            PaymentModel.countDocuments(),
        ])

        const analitics = await UserModel.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ])

        // To'lovlar tarixi tahlili
        const paymentHistory = await PaymentModel.aggregate([
            { $match: { status: "success" } },
            {
                $group: {
                    _id: {
                        year: { $year: "$paymentDate" },
                        month: { $month: "$paymentDate" },
                    },
                    totalAmount: { $sum: "$amount" },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ])

        // "so'm" qo'shib qayta ishlash
        const formattedPaymentHistory = paymentHistory.map((payment) => ({
            ...payment,
            totalAmount: `${payment.totalAmount} so'm`,
        }))

        // Javobni qaytarish
        res.status(200).json({
            ok: true,
            data: [
                { label: "Projectlar", count: totalProjects, type: "number" },
                { label: "Menejerlar", count: totalMenejers, type: "number" },
                { label: "Foydalanuvchilar", count: totalUsers, type: "number" },
                { label: "To'lovlar", count: totalPayments, type: "number" },
                { label: "Oylik obunachilar", count: analitics, type: "array" },
                { label: "To'lovar tarixi", count: formattedPaymentHistory, type: "array" },
            ],
        })
    } catch (error) {
        console.error("Error in dashboard route:", error)
        res.status(500).json({ ok: false, message: error.message })
    }
})

module.exports = {
    path: "/dashboard",
    router,
}
