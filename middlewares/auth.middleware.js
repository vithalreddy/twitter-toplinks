const { User } = require('../models');

const whitelistedURLs = [
    '/login',
    '/api/v1/auth/twitter',
    '/api/v1/auth/twitter/callback',
];

module.exports = app => {
    app.addHook('preHandler', async (req, reply) => {
        const { path: reqPath } = req.urlData();
        if (!reqPath.startsWith('/api/v1/')) return;
        if (whitelistedURLs.includes(reqPath.toLowerCase())) return;

        const { session } = req;

        if (!session || !session.userId) {
            /* eslint-disable */
            return reply.forbidden(`Please Login to Access This Resource.`);
        }
        const user = await User.findOne({
            twitterUserId: session.userId,
        });
        // console.log(user);
        if (!user)
            return reply.forbidden(`Please Login to Access This Resource.`);

        // info: show refresh snackbar message 3 times for new user
        if (req.session.newUser && req.session.newUser <= 3) {
            req.session.newUser += req.session.newUser;
            req.isNewUser = true;
        } else if (req.session.newUser) {
            delete req.session.newUser;
        }
        return;
    });
};
