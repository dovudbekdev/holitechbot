const db = require("../../src/database");

module.exports = async (req, res, next) => {
    const userId = req.query.user_id;
    const projectId = req.params?.projectId;
    console.log(userId, " => UserId");

    if (userId) {
        return res.status(400).send("User ID is required");
    } else {
        try {
            const user = await db.controllers.users.getByUserId(userId);

            req.session.userId = userId;
            if (projectId) req.session.projectId = projectId

            if (!user?.token) {
                return res.redirect("/card-add");
            }

            next();
        } catch (error) {
            res.status(500).send("Server error");
        }
    }
};
