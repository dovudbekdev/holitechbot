const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        projectId: {
            type: String,
        },
        refId: {
            type: String,
        },
        refUserId: {
            type: String,
        },
        isPayed: {
            type: Boolean,
            default: false,
        },

        active: { type: Boolean, default: true },
        status: { type: Boolean, default: true },
        date: { type: Date, default: Date.now() },
    },
    { timestamps: true }
);

const Invite = mongoose.model("Invite", inviteSchema);

module.exports = Invite;
