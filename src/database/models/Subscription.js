const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
      index: true,
    },
    projectId: {
      type: String,
      required: true,
      ref: "Project",
      index: true,
    },
    subscribedAt: {
      type: Number,
      required: true,
    },
    nextPaymentDate: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    monthly: {
      type: Boolean,
      default: false,
    },
    isTrial: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
