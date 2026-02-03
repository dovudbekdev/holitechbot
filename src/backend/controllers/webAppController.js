const axios = require("axios");
const moment = require("moment");
const db = require("../../database");
const cardValidate = require("../validation/cardValidate");
const userIdAndProjectIdValidate = require("../validation/userIdAndProjectIdValidate");
const smsAndUserIdValidate = require("../validation/smsAndUserIdValidate");
const config = require("../../utils/config");
const logger = require("../../utils/logger");
const { sendToTelegram } = require("../../../src/main");

module.exports = class webApp {
  //   static async subscription(req, res) {
  //     try {
  //       const { userId, projectId, duration } =
  //         await userIdAndProjectIdValidate.validateAsync(req.body);

  //       console.log("subscription body", userId, projectId, duration);

  //       // Ma'lumotlar bazasidan userId va projectId ni tekshirish
  //       const [user, project] = await Promise.all([
  //         db.controllers.users.getByUserId(userId),
  //         db.controllers.projects.getProjectById(projectId),
  //       ]);

  //       if (!user || !project) {
  //         return res.status(404).json({
  //           ok: false,
  //           message: "User yoki Loyiha topilmadi",
  //         });
  //       }

  //       if (!user.verifyCard) {
  //         return res.status(402).json({
  //           ok: false,
  //           message: "Foydalanuvchi kartasi qo'shilmagan",
  //         });
  //       }

  //       const priceOption = project.prices.find(
  //         (price) => price.duration === duration
  //       );

  //       if (!priceOption) {
  //         throw new Error("duration not found");
  //       }

  //       console.log("priceOption", priceOption);

  //       // Subscriptionni tekshirish
  //       const forTrialSuubscription =
  //         await db.controllers.subscriptions.getSubscriptionByUserIdAndProjectIdForTrial(
  //           userId,
  //           projectId
  //         );
  //       if (!forTrialSuubscription) {
  //         const trialPeriodDays = 7;
  //         const subscribedAt = moment();
  //         const nextPaymentDate = subscribedAt
  //           .clone()
  //           .add(trialPeriodDays, "days");

  //         // Telegram kanalga invite link yaratish
  //         const inviteResponse = await axios.post(
  //           `https://api.telegram.org/bot${config.BOT_TOKEN}/createChatInviteLink`,
  //           {
  //             chat_id: Number(project.channelId),
  //             name: "1-martalik link",
  //             member_limit: 1,
  //           }
  //         );

  //         // Foydalanuvchiga Telegram orqali xabar yuborish
  //         await axios.post(
  //           `https://api.telegram.org/bot${config.BOT_TOKEN}/sendMessage`,
  //           {
  //             chat_id: userId,
  //             text: `🎁 Sizga 7 kunlik bepul sinov muddati berildi!\n\n🔔 Kanalga qo'shiling va kontentlardan bepul foydalaning.\n\n👉 [Qo'shilish Linki](${inviteResponse.data.result.invite_link})`,
  //             parse_mode: "Markdown",
  //           }
  //         );

  //         await db.controllers.subscriptions.createSubscription({
  //           userId,
  //           projectId,
  //           active: true,
  //           monthly: project.monthly,
  //           subscribedAt: subscribedAt.valueOf(),
  //           nextPaymentDate: nextPaymentDate.valueOf(),
  //           isTrial: true, // kerak bo‘lsa schema-ga qo‘shing
  //         });
  //         return res.status(200).json({
  //           ok: true,
  //           message: "Obuna muvofaqqiyatli yaratildi",
  //         });
  //       } else {
  //         const subscription =
  //           await db.controllers.subscriptions.getSubscriptionByUserIdAndProjectId(
  //             userId,
  //             projectId
  //           );
  //         console.log("subscription bormi:", subscription);

  //         if (subscription) {
  //           return res.status(409).json({
  //             ok: false,
  //             message: "Obuna mavjud",
  //           });
  //         } else {
  //           try {
  //             // User kartasidan pul yechish - Payment
  //             const resPay = await axios.post(
  //               config.BACKEND_API,
  //               {
  //                 method: "receipts.create",
  //                 user_id: user.paymentUserId,
  //                 amount: priceOption.price,
  //               },
  //               {
  //                 headers: {
  //                   Authorization: `Basic ${config.BACKEND_TOKEN}`,
  //                   "Content-Type": "application/json",
  //                 },
  //               }
  //             );

  //             console.log("resPay status", resPay);

  //             await db.controllers.payments.logPayment({
  //               userId,
  //               projectId,
  //               month: priceOption.duration,
  //               invoiceId: resPay.data.data.receipt_id,
  //               amount: resPay.data.data.amount,
  //               status: "success",
  //               errorMessage: "",
  //             });
  //           } catch (e) {
  //             logger.error("To'lov yechilmadi" + e);
  //             return res.status(403).json({
  //               ok: false,
  //               message: "To'lov yechilmadi",
  //             });
  //           }

  //           const response = await axios.post(
  //             `https://api.telegram.org/bot${config.BOT_TOKEN}/createChatInviteLink`,
  //             {
  //               chat_id: Number(project.channelId),
  //               name: "1-martalik link",
  //               member_limit: 1, // Faqat bir kishi uchun
  //             }
  //           );

  //           await axios.post(
  //             `https://api.telegram.org/bot${config.BOT_TOKEN}/sendMessage`,
  //             {
  //               chat_id: userId,
  //               text: `🔔 Kanalga qo'shilib oling! 🔔

  // Link faqat 1 marta ishlaydi!

  // 👉 [Qo'shilish Linki](${response.data.result.invite_link})`,
  //             }
  //           );
  //           // await axios.post(
  //           //   `https://api.telegram.org/bot${config.BOT_TOKEN}/sendMessage`,
  //           //   {
  //           //     chat_id: userId,
  //           //     text: `🔔 Kanalga qo'shilib oling! 🔔\n\nLink faqat 1 marta ishlaydi!`,
  //           //     parse_mode: "Markdown",
  //           //     reply_markup: {
  //           //       inline_keyboard: [
  //           //         [
  //           //           {
  //           //             text: "👉 Qo'shilish",
  //           //             url: response.data.result.invite_link,
  //           //           },
  //           //         ],
  //           //       ],
  //           //     },
  //           //   }
  //           // );

  //           const subscribedAt = moment();

  //           const durationInMonths = priceOption.duration;

  //           const nextPaymentDate = subscribedAt
  //             .clone()
  //             .add(durationInMonths, "months");

  //           // Millisekundlarda saqlash
  //           const subscribedAtMillis = subscribedAt.valueOf();
  //           const nextPaymentDateMillis = nextPaymentDate.valueOf();

  //           console.log("Subscribing At (milliseconds):", subscribedAtMillis);
  //           console.log(
  //             "Next Payment Date (milliseconds):",
  //             nextPaymentDateMillis
  //           );

  //           await db.controllers.subscriptions.createSubscription({
  //             projectId,
  //             userId,
  //             active: true,
  //             monthly: project.monthly,
  //             subscribedAt: subscribedAtMillis,
  //             nextPaymentDate: nextPaymentDateMillis,
  //             isTrial: false,
  //           });

  //           console.log("ref test", userId, projectId);

  //           const y = await db.controllers.invites.updateInvite(
  //             userId,
  //             projectId,
  //             {
  //               isPayed: true,
  //             }
  //           );
  //           console.log("y yest test", y);

  //           return res.status(200).json({
  //             ok: true,
  //             message: "Obuna muvofaqqiyatli yaratildi",
  //           });
  //         }
  //       }
  //     } catch (e) {
  //       console.error(e);
  //       logger.error("subscription.js: " + e);
  //       res.status(404).json({
  //         ok: false,
  //         message: e,
  //       });
  //     }
  //   }
  static async subscription(req, res) {
    try {
      const { userId, projectId, duration } =
        await userIdAndProjectIdValidate.validateAsync(req.body);

      console.log("subscription body", userId, projectId, duration);

      // Ma'lumotlar bazasidan userId va projectId ni tekshirish
      const [user, project] = await Promise.all([
        db.controllers.users.getByUserId(userId),
        db.controllers.projects.getProjectById(projectId),
      ]);

      if (!user || !project) {
        return res.status(404).json({
          ok: false,
          message: "User yoki Loyiha topilmadi",
        });
      }

      if (!user.verifyCard) {
        return res.status(402).json({
          ok: false,
          message: "Foydalanuvchi kartasi qo'shilmagan",
        });
      }

      const priceOption = project.prices.find(
        (price) => price.duration === duration,
      );

      if (!priceOption) {
        throw new Error("duration not found");
      }

      console.log("priceOption", priceOption, userId);

      // Subscriptionni tekshirish
      const subscription =
        await db.controllers.subscriptions.getSubscriptionByUserIdAndProjectId(
          userId,
          projectId,
        );
      console.log("subscription bormi:", subscription, userId);

      if (subscription) {
        return res.status(409).json({
          ok: false,
          message: "Obuna mavjud",
        });
      } else {
        try {
          // User kartasidan pul yechish - Payment
          let payAmount = priceOption.price;
          if (user.isNew == undefined || user.isNew) {
            payAmount = 1000;
          }
          console.log("amount", payAmount);

          const resPay = await axios.post(
            config.BACKEND_API,
            {
              method: "receipts.create",
              user_id: user.paymentUserId,
              amount: payAmount,
            },
            {
              headers: {
                Authorization: `Basic ${config.BACKEND_TOKEN}`,
                "Content-Type": "application/json",
              },
            },
          );

          // console.log("resPay status", resPay);

          await db.controllers.payments.logPayment({
            userId,
            projectId,
            month: priceOption.duration,
            invoiceId: resPay.data.data.receipt_id,
            amount: resPay.data.data.amount,
            status: "success",
            errorMessage: "",
          });

          await db.controllers.users.updateUser(userId, { isNew: false });
        } catch (e) {
          logger.error("To'lov yechilmadi" + e);
          return res.status(403).json({
            ok: false,
            message: "To'lov yechilmadi",
          });
        }

        const response = await axios.post(
          `https://api.telegram.org/bot${config.BOT_TOKEN}/createChatInviteLink`,
          {
            chat_id: Number(project.channelId),
            name: "1-martalik link",
            member_limit: 1, // Faqat bir kishi uchun
          },
        );
        try {
          await axios.post(
            `https://api.telegram.org/bot${config.BOT_TOKEN}/sendMessage`,
            {
              chat_id: userId,
              text: `🔔 Kanalga qo'shilib oling! 🔔

Link faqat 1 marta ishlaydi!

👉 [Qo'shilish Linki](${response.data.result.invite_link})`,
            },
          );
        } catch (error) {
          console.log("dont send message");
        }

        // await axios.post(
        //   `https://api.telegram.org/bot${config.BOT_TOKEN}/sendMessage`,
        //   {
        //     chat_id: userId,
        //     text: `🔔 Kanalga qo'shilib oling! 🔔\n\nLink faqat 1 marta ishlaydi!`,
        //     parse_mode: "Markdown",
        //     reply_markup: {
        //       inline_keyboard: [
        //         [
        //           {
        //             text: "👉 Qo'shilish",
        //             url: response.data.result.invite_link,
        //           },
        //         ],
        //       ],
        //     },
        //   }
        // );

        const subscribedAt = moment();

        const durationInMonths = priceOption.duration;
        // const nextPaymentDate = subscribedAt
        //   .clone()
        //   .add(durationInMonths, "days");
        // keychange
        const nextPaymentDate = subscribedAt
          .clone()
          .add(durationInMonths, "months");

        // Millisekundlarda saqlash
        const subscribedAtMillis = subscribedAt.valueOf();
        const nextPaymentDateMillis = nextPaymentDate.valueOf();

        console.log("Subscribing At (milliseconds):", subscribedAtMillis);
        console.log("Next Payment Date (milliseconds):", nextPaymentDateMillis);

        await db.controllers.subscriptions.createSubscription({
          projectId,
          userId,
          active: true,
          monthly: project.monthly,
          subscribedAt: subscribedAtMillis,
          nextPaymentDate: nextPaymentDateMillis,
        });

        console.log("ref test", userId, projectId);

        await db.controllers.invites.updateInvite(userId, projectId, {
          isPayed: true,
        });
        // console.log("y yest test", y);

        return res.status(200).json({
          ok: true,
          message: "Obuna muvofaqqiyatli yaratildi",
        });
      }
    } catch (e) {
      // console.error(e);
      logger.error("subscription.js: " + e);
      res.status(404).json({
        ok: false,
        message: e,
      });
    }
  }

  static async cardPost(req, res) {
    try {
      let { cardName, cardNumber, expiryDate, userId } =
        await cardValidate.validateAsync(req.body);

      expiryDate = expiryDate.replace(/\D/g, "");

      console.log("bu meni loglarim", cardName, cardNumber, expiryDate, userId);

      // Payment
      try {
        const resAddCard = await axios.post(
          config.BACKEND_API,
          {
            method: "cards.create",
            card_number: cardNumber,
            expire_date: expiryDate,
          },
          {
            headers: {
              Authorization: `Basic ${config.BACKEND_TOKEN}`,
              "Content-Type": "application/json",
            },
          },
        );
        console.log("Yaratilayotgan card =>", resAddCard.data);

        await db.controllers.users.updateUser(userId, {
          paymentUserId: resAddCard.data.user_id,
        });

        res.status(200).json({
          ok: true,
          message: "Tasdiqlash kodi yuborildi",
        });
      } catch (e) {
        console.log(e.response.data, "/ntest/n", e.response);

        if (e.response && e.response.status === 400) {
          logger.error("cardPost 400: " + e);
          return res.status(403).json({
            ok: false,
            message: "Karta ma'lumotlarini tasdiqlab bo'lmadi",
          });
        } else {
          console.error(e);
          logger.error("cardPost 500: " + e);
          return res.status(500).json({
            ok: false,
            message: "Serverda xatolik yuz berdi",
          });
        }
      }
    } catch (e) {
      console.error(e);
      logger.error("cardPost 400: " + e);
      res.status(404).json({
        ok: false,
        message: e.toString().replace("Error:", "").trim(),
      });
    }
  }

  static async smsCheck(req, res) {
    try {
      const { smsCode, userId } = await smsAndUserIdValidate.validateAsync(
        req.body,
      );

      const user = await db.controllers.users.getByUserId(userId);

      if (!user?.paymentUserId) {
        return res.status(403).json({
          ok: false,
          message: "Tasdiqlash kodi xato qayta urinib ko'ring",
        });
      }

      // Verify sms code
      try {
        const resVerify = await axios.post(
          config.BACKEND_API,
          {
            method: "cards.verify",
            user_id: user?.paymentUserId,
            code: smsCode,
          },
          {
            headers: {
              Authorization: `Basic ${config.BACKEND_TOKEN}`,
              "Content-Type": "application/json",
            },
          },
        );
        console.log("resVerify", resVerify);
      } catch (e) {
        logger.error("smsCheck 1: " + e);
        return res.status(403).json({
          ok: false,
          message: "Tasdiqlash kodi xato qayta urinib ko'ring",
        });
      }

      await db.controllers.users.updateUser(userId, {
        verifyCard: true,
      });

      return res.status(200).json({
        ok: true,
        message: "Karta muvofaqqiyatli qo'shildi",
      });
    } catch (e) {
      logger.error("smsCheck 2: " + e);
      res.status(404).json({
        ok: false,
        message: e.toString().replace("Error:", "").trim(),
      });
    }
  }

  static async close(req, res) {
    try {
      const { userId, message } = req.body;
      console.log("close", userId);

      await sendToTelegram(userId, message);

      return res.status(200).json({
        ok: true,
      });
    } catch (e) {
      logger.error("close: " + e);
      res.status(404).json({
        ok: false,
        message: e.toString().replace("Error:", "").trim(),
      });
    }
  }
};
