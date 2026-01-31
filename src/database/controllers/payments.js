const { Payment } = require("../models");

const logPayment = async (data) => {
    const payment = new Payment(data);

    try {
        await payment.save();
        console.log(
            `Payment history logged for userId: ${data.userId}, projectId: ${data.projectId}, invoiceId: ${data.invoiceId}`
        );
    } catch (error) {
        console.error(`Error logging payment history: ${error.message}`);
    }
};

const getPaymentHistoriesByUser = async (userId) => {
    try {
        const paymentHistories = await Payment.find({ userId });
        return paymentHistories;
    } catch (error) {
        console.error(
            `Error fetching payment histories for userId ${userId}: ${error.message}`
        );
        throw error;
    }
};

module.exports = {
    logPayment,
    getPaymentHistoriesByUser,
};
