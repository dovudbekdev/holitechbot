const mongoose = require("mongoose")
const ShortUniqueId = require("short-unique-id")
const { randomUUID } = new ShortUniqueId({ length: 10 })

const projectSchema = new mongoose.Schema(
    {
        projectId: {
            type: String,
            required: true,
            default: randomUUID(),
            index: true,
        },
        channelName: {
            type: String,
            required: true,
        },
        channelId: {
            type: String,
            required: true,
        },
        botLink: {
            type: String,
            required: true,
        },
        prices: [
            {
                _id: false, 
                duration: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],
        monthly: {
            type: Boolean,
            required: true,
        },
        image: {
            type: String,
            required: false,
        },
        description: {
            type: String,
            required: false,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
)

const Project = mongoose.model("Project", projectSchema)

module.exports = Project
