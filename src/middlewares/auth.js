const db = require("../database");

module.exports = async (ctx, next) => {
    try {
        if (ctx.chat.type === "private") {
            let user = await db.controllers.users.getByUserId(ctx.from.id);
            if (!user) {
                user = await db.controllers.users.create({
                    userId: ctx.from.id,
                });
            }
            ctx.session.user = user;
            return next();
        } else {
            return next();
        }
    } catch (e) {
        console.log(e);
    }
};
