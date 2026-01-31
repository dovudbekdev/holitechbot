const moment = require("moment");
const axios = require("axios");
const config = require("./config");
const db = require("../database");
const formattedDate = require("./formatDate");
const logger = require("./logger");

async function checkSubscriptions(bot) {
  try {
    const nowDate = new Date().getTime(); // Hozirgi vaqt millisekundlarda
    const formatDate = formattedDate(nowDate);

    logger.info(
      `Kunlik to'lovlarni tekshirish jarayoni boshlandi. - ${formatDate}`
    );

    let yangilanmadi = 0;
    let yangilandi = 0;
    let kickUser = 0;

    const subscriptions = await db.controllers.subscriptions.subscriptionsToday(
      nowDate
    );

    const tasks = subscriptions.map(async (subscription) => {
      const { userId, projectId, isTrial } = subscription;

      const [user, project] = await Promise.all([
        db.controllers.users.getByUserId(userId),
        db.controllers.projects.getProjectById(projectId),
      ]);

      try {
        if (!user || !project) {
          console.log(
            `Foydalanuvchi yoki loyiha topilmadi: userId=${userId}, projectId=${projectId}`
          );
          throw new Error("Foydalanuvchi yoki loyiha topilmadi");
        }

        // User kartasidan pul yechish - Payment
        const resPay = await axios.post(
          config.BACKEND_API,
          {
            method: "receipts.create",
            user_id: user.paymentUserId,
            amount: project.prices[0].price,
          },
          {
            headers: {
              Authorization: `Basic ${config.BACKEND_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (resPay.status === 200) {
          // Obuna yangilash
          const subscribedAt = subscription.nextPaymentDate;
          // const nextPaymentDate = moment(subscribedAt)
          //   .add(1 * project.prices[0].duration, "days")
          //   .valueOf();
          // keychange
          const nextPaymentDate = moment(subscribedAt)
            .add(1 * project.prices[0].duration, "month")
            .valueOf();

          await db.controllers.subscriptions.updateSubscriptionById(
            subscription._id,
            {
              nextPaymentDate,
            }
          );

          await db.controllers.payments.logPayment({
            userId,
            projectId,
            month: project.prices[0].duration,
            invoiceId: resPay.data.data.receipt_id,
            amount: resPay.data.data.amount,
            status: "success",
            errorMessage: "",
          });

          yangilandi++;
          console.log(`Foydalanuvchi ${userId} uchun obuna yangilandi.`);

          const message = `Hurmatli ${user.firstName}, sizning "${
            project.channelName
          }" obunangiz muvaffaqiyatli yangilandi. Keyingi to'lov sanasi: ${formattedDate(
            nextPaymentDate
          )}.`;

          await bot.telegram.sendMessage(user.tgUserInfo.id, message);
        } else {
          throw new Error("To'lov muvaffaqiyatsiz bo'ldi");
        }
      } catch (err) {
        logger.error(
          `Foydalanuvchi ${userId} uchun obunani yangilashda xato: ${err.message}`
        );
        if (isTrial) {
          await Promise.all([
            bot.telegram.sendMessage(
              user.tgUserInfo.id,
              `Hurmatli ${user.firstName}, sizning "${project.channelName}" bepul obunangizni vaqti tugadi va obunani yangilab bo'lmadi. To'lovni amalga oshirmagani uchun kanaldan chiqarilib yuborildingiz.`
            ),
            bot.telegram.kickChatMember(project.channelId, user.tgUserInfo.id),
            bot.telegram.unbanChatMember(project.channelId, user.tgUserInfo.id),
            db.controllers.subscriptions.updateSubscriptionById(
              subscription._id,
              {
                active: false,
              }
            ),
          ]);

          kickUser++;
        } else {
          const fiveDaysAgo = moment().subtract(5, "days").valueOf(); // 5 kun oldingi vaqtni millisekundlarda olish

          const now = moment();
          const nextPaymentDate = moment(subscription.nextPaymentDate);

          if (subscription.nextPaymentDate < fiveDaysAgo) {
            await Promise.all([
              bot.telegram.sendMessage(
                user.tgUserInfo.id,
                `Hurmatli ${user.firstName}, sizning "${project.channelName}" obunangizni yangilab bo'lmadi. to'lovni 5 kun ichida amalga oshirmaganiz uchun kanaldan chiqarilib yuborildingiz.`
              ),
              bot.telegram.kickChatMember(
                project.channelId,
                user.tgUserInfo.id
              ),
              bot.telegram.unbanChatMember(
                project.channelId,
                user.tgUserInfo.id
              ),
              db.controllers.subscriptions.updateSubscriptionById(
                subscription._id,
                {
                  active: false,
                }
              ),
            ]);

            kickUser++;
          } else {
            const daysLeft = 5 - now.diff(nextPaymentDate, "days");

            await bot.telegram.sendMessage(
              user.tgUserInfo.id,
              `Hurmatli ${user.firstName}, sizning "${project.channelName}" obunangizni yangilab bo'lmadi. Iltimos, ${daysLeft} kun ichida to'lov qiling, aks holda siz kanaldan chiqarib yuborilasiz.`
            );

            yangilanmadi++;
          }
        }
      }
    });

    await Promise.all(tasks);

    const txt = `\nKunlik to'lovlarni tekshirish jarayoni yakunlandi. - ${formattedDate(
      new Date().getTime()
    )} 
Yangilandi: ${yangilandi}
Yangilanmadi: ${yangilanmadi}
Kanaldan chiqarildi: ${kickUser}
Umumiy: ${subscriptions.length}
`;
    const adminId = process.env.ADMIN_ID;

    await bot.telegram.sendMessage(adminId, txt);

    logger.info(txt);
  } catch (e) {
    console.log("Cron", e);
    logger.error("cron.js: " + e);
  }
}

module.exports = checkSubscriptions;
