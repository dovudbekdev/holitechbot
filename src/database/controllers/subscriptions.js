// const moment = require("moment");
const { Subscription } = require("./../models");

const createSubscription = async (data) => {
  const subscription = new Subscription(data);

  return await subscription.save();
};

const getSubscriptionsByUserId = async (userId) => {
  return await Subscription.find({ userId, active: true });
};

const getSubscriptionsByProjectId = async (projectId) => {
  return await Subscription.find({ projectId });
};

const getSubscriptionByUserIdAndProjectId = async (userId, projectId) => {
  return await Subscription.findOne({ userId, projectId, active: true });
};
const getSubscriptionByUserIdAndProjectIdForTrial = async (
  userId,
  projectId
) => {
  return await Subscription.findOne({ userId, projectId });
};

// const cancelSubscription = async (userId, projectId) => {
//     return await Subscription.findOneAndUpdate(
//         { userId, projectId },
//         { active: false },
//         { new: true }
//     );
// };

const cancelSubscription = async (subscriptionId) => {
  return await Subscription.findByIdAndUpdate(
    subscriptionId,
    { active: false },
    { new: true }
  );
};

const deleteAllSubscriptions = async () => {
  const result = await Subscription.deleteMany({});
  if (result.deletedCount > 0) {
    return {
      message: `${result.deletedCount} subscriptions successfully deleted`,
    };
  } else {
    return { message: "No subscription found" };
  }
};

const updateSubscriptionById = async (id, data) => {
  return await Subscription.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, useFindAndModify: false }
  );
};

// const countAllSubscriptionsToday = async () => {
//     const startOfDay = new Date();
//     startOfDay.setHours(0, 0, 0, 0); // Kun boshidan
//     const endOfDay = new Date();
//     endOfDay.setHours(23, 59, 59, 999); // Kun oxiridan
//     return await Subscription.countDocuments({
//         active: true,
//         monthly: true,
//         subscribedAt: {
//             $gte: startOfDay,
//             $lte: endOfDay,
//         },
//     });
// };

const getSubscriptionById = async (id) => {
  try {
    return await Subscription.findById(id);
  } catch (error) {
    console.error(`Error fetching subscription by id: ${error.message}`);
    throw error;
  }
};

// To'lov muddati yetib kelgan obunalar
const subscriptionsToday = async (endTime) => {
  return await Subscription.find({
    active: true,
    monthly: true,
    nextPaymentDate: {
      $lte: endTime,
    },
  });
};

// To'lov muddati yetib kelgan obunalar soni
const countAllSubscriptionsToday = async (endTime) => {
  return await Subscription.countDocuments({
    active: true,
    monthly: true,
    nextPaymentDate: {
      $lte: endTime,
    },
  });
};

module.exports = {
  createSubscription,
  getSubscriptionsByUserId,
  getSubscriptionsByProjectId,
  getSubscriptionByUserIdAndProjectId,
  getSubscriptionByUserIdAndProjectIdForTrial,
  cancelSubscription,
  deleteAllSubscriptions,
  subscriptionsToday,
  updateSubscriptionById,
  countAllSubscriptionsToday,
  getSubscriptionById,
};
