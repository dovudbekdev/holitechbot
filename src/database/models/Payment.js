const mongoose = require("mongoose");

const paymentHistorySchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        projectId: {
            type: String,
            required: true,
            index: true,
        },
        month: {
            type: Number,
            required: true,
        },
        invoiceId: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["success", "failure"],
            required: true,
        },
        paymentDate: {
            type: Date,
            default: Date.now,
        },
        errorMessage: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const Payments = mongoose.model("PaymentHistory", paymentHistorySchema);

module.exports = Payments;
