const bcrypt = require("bcrypt");
const MenejerModel = require("../../database/models/Menejer");

// exports.getall = async (req, res) => {
//   try {
//     const { page = 1, item = 10 } = req.query;

//     const totalMenejers = await MenejerModel.countDocuments({
//       active: true,
//     });

//     const menejers = await MenejerModel.find({ active: true })
//       .select("-password")
//       .skip((page - 1) * item)
//       .limit(parseInt(item));

//     const menegrData = meneger.map((item) => {

//         item.refId
//     });

//     res
//       .status(200)
//       .json({ ok: true, menejers: { ...menejers }, total: totalMenejers });
//   } catch (error) {
//     console.error("Error in getAllMenejers:", error);
//     res.status(404).json({ ok: false, message: error.message });
//   }
// };

exports.getall = async (req, res) => {
  try {
    const totalMenejers = await MenejerModel.countDocuments({ active: true });

    const menejers = await MenejerModel.aggregate([
      { $match: { active: true } },
      {
        $lookup: {
          from: "invites",
          localField: "refId",
          foreignField: "refId",
          as: "invites",
        },
      },
      {
        $addFields: {
          inviteCount: {
            $size: {
              $filter: {
                input: "$invites",
                as: "invite",
                cond: { $eq: ["$$invite.isPayed", true] },
              },
            },
          },
        },
      },
      {
        $project: {
          password: 0,
          invites: 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({
      ok: true,
      menejers,
      total: totalMenejers,
    });
  } catch (error) {
    console.error("Error in getAllMenejers:", error);
    res.status(404).json({ ok: false, message: error.message });
  }
};

exports.getByID = async (req, res) => {
  try {
    const menejer = await MenejerModel.findById({
      _id: req.params.id,
    }).select("-password");

    if (menejer) {
      res.status(200).json({ ok: true, menejer });
    } else {
      res.status(404).json({ ok: true, message: "User not undifayned" });
    }
  } catch (error) {
    console.error("Error in getMenejerById:", error);
    res.status(404).json({ ok: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    req.body.password = hash;

    console.log("tt", req.body);

    const data = new MenejerModel({
      ...req.body,
      // clubs: req.body.clubs || [],
    });

    await data.save();
    data.password = undefined;

    res.status(200).json({ ok: true, data });
  } catch (error) {
    console.error("Error in createMenejer:", error);
    res.status(404).json({ ok: false, message: error.message });
  }
};

exports.updateById = async (req, res) => {
  try {
    const menejer = await MenejerModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!menejer) {
      return res.status(404).json({ ok: false, message: "Menejer not found" });
    }

    menejer.password = undefined;

    res.status(200).json({ ok: true, result: menejer });
  } catch (error) {
    console.error("Error in updateMenejerById:", error);
    res.status(404).json({ ok: false, message: error.message });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const menejer = await MenejerModel.findByIdAndUpdate(req.params.id, {
      active: false,
    });

    if (!menejer) {
      return res.status(404).json({ ok: false, message: "Menejer not found" });
    }

    res.status(200).json({
      ok: true,
      data: "Menejer removed successfully",
    });
  } catch (error) {
    console.error("Error in deleteMenejerById:", error);
    res.status(404).json({ ok: false, message: error.message });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const menejers = await MenejerModel.updateMany({ active: false });

    res.status(200).json({ ok: true, data: menejers });
  } catch (error) {
    console.error("Error in deleteAllMenejers:", error);
    res.status(404).json({ ok: false, message: error.message });
  }
};
