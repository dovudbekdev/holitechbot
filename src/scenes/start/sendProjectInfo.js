const { Markup } = require("telegraf");
const path = require("path");
const fs = require("fs");
const db = require("../../database");
const config = require("../../utils/config");

module.exports = async (ctx, project) => {
  try {
    const userId = ctx.from.id;

    try {
      const filePath = path.join(__dirname, "../../video/dumaloq.mp4");

      if (fs.existsSync(filePath)) {
        try {
          await ctx.replyWithVideoNote({ source: filePath });
        } catch (error) {
          if (error.message.includes("VOICE_MESSAGES_FORBIDDEN")) {
            console.error(
              "Error sending video note: VOICE_MESSAGES_FORBIDDEN. Sending video instead."
            );
            // Optional: Send a regular video if video note is not supported
            await ctx.replyWithVideo({ source: filePath });
          } else {
            console.error("Error sending video note:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error handling video file:", error);
    }

    /* try {
            const videoUrl =
                "https://res.cloudinary.com/drqsvaf78/video/upload/v1725287715/launchpro/fjejwweqzceamkgbxwem.mp4"

            await ctx.replyWithVideoNote({ url: videoUrl })
        } catch (error) {
            console.error("Error sending video note:", error)
        }  */

    // Check if the user has a subscription
    const isSubscription =
      await db.controllers.subscriptions.getSubscriptionByUserIdAndProjectId(
        userId,
        project.projectId
      );
    let url = `${config.URL}?project_id=${project.projectId}&user_id=${userId}`;
    if (isSubscription) {
      url = `${config.URL}/subscription`;
    }

    // Create subscription buttons
    const subscriptionButtons = project.prices.map((priceOption) => {
      const button = {
        text: `${priceOption.duration} oylik - ${priceOption.price} so'm`,
        web_app: {
          url: url,
        },
      };

      // Agar obuna mavjud bo'lmasa, URL ga duration qo'shiladi
      if (!isSubscription) {
        button.web_app.url = `${url}&duration=${priceOption.duration}`;
      }

      return button;
    });

    let keyboard = Markup.inlineKeyboard(
      subscriptionButtons.map((button) => [button])
    ).resize();

    let caption = `${project.channelName ? project.channelName : ""}
${project.description ? project.description : ""}

💎 Obuna turi: ${project.monthly ? "Oyma oy to'lov" : "1 marttalik to'lov"}`;

    if (project.image) {
      await ctx.replyWithPhoto(project.image, {
        caption,
        reply_markup: keyboard.reply_markup,
        parse_mode: "Markdown",
      });
    } else {
      await ctx.reply(caption, {
        reply_markup: keyboard.reply_markup,
        parse_mode: "Markdown",
      });
    }

    // Schedule a message to be sent 15 minutes later
    setTimeout(async () => {
      try {
        const isSubscription =
          await db.controllers.subscriptions.getSubscriptionByUserIdAndProjectId(
            userId,
            project.projectId
          );
        if (!isSubscription) {
          let caption = `Hali ham klubizmizga qo'shilmadingizmi? 
                    Siz uchun chegirmada 6 oylik obunamiz oyiga atigi 39 ming so'mdan
                
${project.channelName ? project.channelName : ""} 
${project.description ? project.description : ""}

💎 Obuna turi: ${project.monthly ? "Oyma oy to'lov" : "1 marttalik to'lov"}`;

          if (project.image) {
            await ctx.replyWithPhoto(project.image, {
              caption,
              reply_markup: keyboard.reply_markup,
              parse_mode: "Markdown",
            });
          } else {
            await ctx.reply(caption, {
              reply_markup: keyboard.reply_markup,
              parse_mode: "Markdown",
            });
          }
        }
        return;
      } catch (err) {
        console.log("Error sending delayed message: " + err);
      }
    }, 15 * 60 * 1000); // 15 minutes in milliseconds
  } catch (e) {
    console.log("sendProjectInfo: " + e);
  }
};
