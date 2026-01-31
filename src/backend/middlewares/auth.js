const jwt = require("jsonwebtoken");
const Menejer = require("../../database/models/Menejer");

const checkAuthMenejer = async (req, res, next) => {
  if (!req?.headers?.authorization) {
    return res.status(404).json({
      message: "Нет доступа или токен",
    });
  }

  const token = req.headers.authorization?.replace(/Bearer\s?/, "");

  if (token) {
    try {
      //key**
      const decoded = jwt.verify(token, "palma-admin-secret123");

      const user = await Menejer.findById(decoded["_id"]);

      if (!user) {
        return res.status(404).json({
          message: "Пользователь не найден",
        });
      }

      if (user.role !== "menejer") {
        return res.status(404).json({
          message: "У вас нету такого доступа",
        });
      }

      req.user = user;

      next();
    } catch (e) {
      return res.status(403).json({
        message: "Нет доступа catch",
      });
    }
  } else {
    return res.status(403).json({
      message: "Нет доступа token",
    });
  }
};

module.exports = checkAuthMenejer;
