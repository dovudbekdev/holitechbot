const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Subscription } = require("../../database/models");
const Menejer = require("../../database/models/Menejer");
const User = require("../../database/models/User");
const Project = require("../../database/models/Project");

exports.getall = async (req, res) => {
  try {
    const { page = 1, item = 10 } = req.query;

    const endTime = new Date().getTime();

    const total = await Subscription.countDocuments({
      active: true,
      monthly: true,
      nextPaymentDate: {
        $lte: endTime,
      },
    });

    const subscriptions = await Subscription.find({
      active: true,
      monthly: true,
      nextPaymentDate: {
        $lte: endTime,
      },
    })
      .skip((page - 1) * item)
      .limit(parseInt(item));

    const subscriptionsWithUserDetails = await Promise.all(
      subscriptions.map(async (subscription) => {
        const user = await User.findOne({ userId: subscription.userId });
        const project = await Project.findOne({
          projectId: subscription.projectId,
        });
        return {
          ...subscription.toObject(), // Convert the Mongoose document to a plain object
          user: user ? user.toObject() : null, // Include the user details
          project: project ? project.toObject() : null, // Include the user details
        };
      })
    );

    res.status(200).json({
      ok: true,
      subscriptions: subscriptionsWithUserDetails,
      total,
    });
  } catch (error) {
    console.log("error getall", error);
    res.status(404).json({ ok: false, message: error + "" });
  }
};

exports.updateById = async (req, res) => {
  try {
    const result = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({ ok: true, result });
  } catch (error) {
    console.log("error getall", error);
    res.status(404).json({ ok: false, message: error + "" });
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await Menejer.findOne({
      $or: [{ phone_number: req.body.login }],
    });

    console.log("Login user", user);

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "Foydalanuvchi topilmadi",
      });
    }

    const isValidPass = bcrypt.compare(req.body.password, user.password);
    if (!isValidPass) {
      throw BaseError.BadRequestError("Parol notog'ri");
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "palma-admin-secret123"
    );
    //key**

    const { password, ...userData } = user._doc;

    res.status(200).json({
      ok: true,
      ...userData,
      token,
    });
  } catch (error) {
    next(error);
  }
};
