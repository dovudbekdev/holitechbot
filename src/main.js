const schedule = require("node-schedule");
const checkSubscriptions = require("./utils/cron");

const bot = require("./core/bot"); // Bot instance
const stage = require("./scenes"); // Sahnalar
const session = require("./core/session"); // Sessiya boshqaruvi
const auth = require("./middlewares/auth"); // Avtorizatsiya middleware
const logger = require("./utils/logger");
const UserModel = require("./database/models/User");
const config = require("./utils/config");

// Middleware
bot.use(session);
bot.use(stage.middleware());
bot.use(auth);

bot.command("speed", async (ctx) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log("Response time: %sms", ms);
  ctx.reply(`Bot javob berish tezligi: ${ms}milsek`);
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

bot.on("channel_post", async (ctx) => {
  const message = ctx.channelPost;
  console.log("Kanalga yangi xabar keldi:", message);

  try {
    if (
      message.reply_to_message &&
      ctx.chat.id == config.ADS_CHANNEL &&
      message.text === "/post"
    ) {
      const startTime = Date.now();

      const repliedMessage = message.reply_to_message;

      // Barcha foydalanuvchilarni bazadan olish
      const users = await UserModel.find({});
      const totalUsers = users.length;

      let successCount = 0;
      let failureCount = 0;

      const messagesPerSecond = 10; // Har soniyada yuboriladigan xabarlar soni
      const delayBetweenMessages = 1000 / messagesPerSecond; // Millisekundlarda delay

      for (const user of users) {
        try {
          await ctx.telegram.forwardMessage(
            user.userId,
            ctx.chat.id,
            repliedMessage.message_id
          );

          successCount++;
        } catch (err) {
          failureCount++;
          console.log(`Xabar yuborishda xatolik: ${user.userId}`, err);
        }

        // Har bir xabar yuborish orasida delay qo'shish
        await delay(delayBetweenMessages);
      }

      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000; // Sekundlarda vaqtni hisoblash

      await ctx.reply(
        `Xabar yuborish yakunlandi:\n\n` +
          `Muvaffaqiyatli yuborilgan xabarlar: ${successCount}\n` +
          `Yuborilmadi: ${failureCount}\n` +
          `Jami foydalanuvchilar: ${totalUsers}\n` +
          `Yuborish davomiyligi: ${duration.toFixed(2)} sekund`
      );

      console.log(
        `Yuborish yakunlandi:\n` +
          `Muvaffaqiyatli yuborilgan: ${successCount}\n` +
          `Yuborilmadi: ${failureCount}\n` +
          `Jami foydalanuvchilar: ${totalUsers}\n` +
          `Yuborish davomiyligi: ${duration.toFixed(2)} sekund`
      );
    }
  } catch (e) {
    console.log("Xatolik:", e);
  }
});

/* 
bot.command("/post", async (ctx) => {
    try {
        if (ctx.message.reply_to_message && ctx.chat.id == config.ADS_CHANNEL) {
            const startTime = Date.now()

            const repliedMessage = ctx.message.reply_to_message

            // Barcha foydalanuvchilarni bazadan oling
            const users = await UserModel.find({})
            const totalUsers = users.length

            let successCount = 0
            let failureCount = 0

            const messagesPerSecond = 10 // Har soniyada yuboriladigan xabarlar soni
            const delayBetweenMessages = 1000 / messagesPerSecond // Millisekundlarda delay

            for (const user of users) {
                try {
                    await ctx.telegram.copyMessage(
                        user.userId, // Qabul qiluvchi foydalanuvchining ID
                        ctx.chat.id, // Reply qilingan xabar yuborilgan chat ID
                        repliedMessage.message_id, // Reply qilingan xabarning ID-si
                        {
                            caption: repliedMessage.caption || "", // Caption qo'shish, agar mavjud bo'lsa
                        }
                    )

                    // await ctx.telegram.forwardMessage(
                    //     user.userId, 
                    //     ctx.chat.id, 
                    //     repliedMessage.message_id 
                    // )

                    successCount++
                } catch (err) {
                    failureCount++
                    console.log(`Xabar yuborishda xatolik: ${user.userId}`, err)
                }

                // Har bir xabar yuborish orasida delay qo'shish
                await delay(delayBetweenMessages)
            }

            const endTime = Date.now()
            const duration = (endTime - startTime) / 1000 // Sekundlarda vaqtni hisoblash

            await ctx.reply(
                `Xabar yuborish yakunlandi:\n\n` +
                    `Muvaffaqiyatli yuborilgan xabarlar: ${successCount}\n` +
                    `Yuborilmadi: ${failureCount}\n` +
                    `Jami foydalanuvchilar: ${totalUsers}\n` +
                    `Yuborish davomiyligi: ${duration.toFixed(2)} sekund`
            )

            console.log(
                `Yuborish yakunlandi:\n` +
                    `Muvaffaqiyatli yuborilgan: ${successCount}\n` +
                    `Yuborilmadi: ${failureCount}\n` +
                    `Jami foydalanuvchilar: ${totalUsers}\n` +
                    `Yuborish davomiyligi: ${duration.toFixed(2)} sekund`
            )
        } else {
            await ctx.reply("Iltimos, avval xabarga reply qiling.")
        }
    } catch (e) {
        console.log("Xatolik:", e)
    }
}) */

bot.start(async (ctx) => {
  if (ctx.chat.type === "private") {
    ctx.scene.enter("start");
  }
});

//keychange
const job = schedule.scheduleJob(
  "0 0 * * *",
  async () => await checkSubscriptions(bot)
);

// const job = schedule.scheduleJob(
//   "0 9 * * *",
//   async () => await checkSubscriptions(bot)
// );

async function sendToTelegram(userId, message = "/start") {
  console.log("sendToTelegram ishladi");
  try {
    await bot.telegram.sendMessage(userId, message);
  } catch (err) {
    if (
      err.code === 403 ||
      err.description?.includes("bot was blocked by the user")
    ) {
      console.warn(`Foydalanuvchi ${userId} botni bloklagan.`);
    } else {
      console.error("Xatolik: sendToTelegram", err);
    }
    // console.error("Error sending log to Telegram:", err);
  }
}

(async () => {
  try {
    const users = await UserModel.find({});
    for (const user of users) {
      await sendToTelegram(
        user.userId,
        // "Bot qayta ishga tushdi. /start buyrug'ini bosing."
        "/start"
      );
      await delay(50); // Sekin yuborish
    }
    console.log("Barcha foydalanuvchilarga xabar yuborildi.");
  } catch (error) {
    console.error("Foydalanuvchilarga xabar yuborishda xatolik:", error);
  }
})();

// Xatolarni ushlash
bot.catch((err, ctx) => {
  // logger.error(`Bot handler error ${err}`);
  // ctx.reply(`Xatolik yuz berdi. Botni qayta ishga tushurib ko'ring. /start`);
  logger.error(`Bot handler error: ${err.message}`);

  // Agar foydalanuvchi botni bloklagan bo‘lsa yoki boshqa reply bo‘lmaydigan xatolik bo‘lsa
  if (
    err.code === 403 ||
    err.description?.includes("bot was blocked by the user")
  ) {
    console.log(`Foydalanuvchi ${ctx.from?.id} botni bloklagan.`);
    return;
  }

  // Aks holda foydalanuvchiga javob yuboriladi
  if (ctx.reply) {
    ctx.reply("Xatolik yuz berdi. Botni qayta ishga tushurib ko'ring. /start");
  }
});

module.exports = { bot, sendToTelegram };
