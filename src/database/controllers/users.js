const axios = require("axios");
const { User } = require("../models");
const config = require("../../utils/config");

const create = async (data) => {
  const user = new User(data);
  return await user.save();
};

const getByUserId = async (id) => {
  return await User.findOne({ userId: id });
};

const getCount = async () => {
  return await User.estimatedDocumentCount();
};

const getAll = async () => {
  return await User.find();
};

const setStatus = async (userId, isActive) => {
  return await User.findOneAndUpdate({ userId }, { $set: { isActive } });
};

const updateUser = async (userId, data) => {
  return await User.findOneAndUpdate(
    { userId },
    { $set: data },
    { new: true, upsert: true }
  );
};

const deleteAllUsers = async () => {
  const result = await User.deleteMany({});
  if (result.deletedCount > 0) {
    return {
      message: `${result.deletedCount} users successfully deleted`,
    };
  } else {
    return { message: "No users found" };
  }
};

const deleteCard = async (userId) => {
  try {
    const user = await getByUserId(userId);

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { $set: { verifyCard: false, paymentUserId: null } },
      { new: true }
    );

    const resPay = await axios.post(
      config.BACKEND_API,
      {
        method: "cards.remove",
        user_id: user.paymentUserId,
      },
      {
        headers: {
          Authorization: `Basic ${config.BACKEND_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return "Karta muvaffaqqiyatli o'chirildi";
  } catch (e) {
    console.error("deleteCard.js: ", e.message || e);
    return "Karta o'chirishda xato";
  }
};

module.exports = {
  create,
  getByUserId,
  getCount,
  getAll,
  setStatus,
  updateUser,
  deleteAllUsers,
  deleteCard,
};
