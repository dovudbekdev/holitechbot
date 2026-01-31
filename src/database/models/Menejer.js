const mongoose = require("mongoose");
const ShortUniqueId = require("short-unique-id");
const { randomUUID } = new ShortUniqueId({ length: 10 });

const MenejerSchema = new mongoose.Schema(
  {
    id: { type: String, default: randomUUID() },
    full_name: { type: String },
    refId: { type: String },
    refLink: {
      type: String,
    },
    phone_number: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["menejer", "founder"],
      default: "menejer",
    },

    active: { type: Boolean, default: true },
    status: { type: Boolean, default: true },
    date: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menejer", MenejerSchema);
