const { Invite } = require("../models");

const create = async (data) => {
  try {
    const invite = await Invite.findOneAndUpdate(
      { userId: data.userId, projectId: data.projectId },
      data,
      { new: true, upsert: true }
    );

    return invite;
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
  }
};

const deleteAllInvites = async () => {
  const result = await Invite.deleteMany({});
  if (result.deletedCount > 0) {
    return {
      message: `${result.deletedCount} invites successfully deleted`,
    };
  } else {
    return { message: "No invites found" };
  }
};

const updateInvite = async (userId, projectId, data) => {
  try {
    return await Invite.findOneAndUpdate(
      { userId, projectId },
      { $set: data },
      { new: true }
    );
  } catch (error) {
    console.error("Error updating invite:", error);
  }
};

const findOne = async (filter) => {
  try {
    return await Invite.findOne(filter);
  } catch (error) {
    console.error("findOne xatoligi:", error);
    return null;
  }
};

// const getCount = async () => {
//     return await Invite.estimatedDocumentCount();
// };

// const getAll = async () => {
//     return await Invite.find();
// };

module.exports = {
  create,
  deleteAllInvites,
  updateInvite,
  findOne,
};
