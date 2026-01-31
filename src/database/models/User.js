const mongoose = require("mongoose");
const ShortUniqueId = require("short-unique-id");
const { randomUUID } = new ShortUniqueId({ length: 10 });

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
      index: true,
    },
    id: { type: String, default: () => randomUUID() },
    tgUserInfo: {
      type: Object,
      required: false,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    projectId: {
      type: String,
      index: true,
    },
    paymentUserId: {
      type: String,
    },
    verifyCard: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
