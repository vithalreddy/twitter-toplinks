const { auth: authCtrl } = require('../controllers');

module.exports = (app, opts, done) => {
    app.get('/twitter', async (req, reply) => {
        const [err, { tokenSecret, url }] = await app.to(authCtrl.login());

        if (err) {
            return reply.internalServerError(
                `Something Went Wrong, Please Try Again.`
            );
        }

        req.session.tokenSecret = tokenSecret;

        return reply.redirect(url);
    });

    app.get('/twitter/callback', async (req, reply) => {
        // eslint-disable-next-line
        const { oauth_token, oauth_verifier } = req.query;

        const [err, user] = await app.to(
            authCtrl.twitterCallback(
                oauth_token,
                oauth_verifier,
                req.session.tokenSecret
            )
        );

        if (err) {
            return reply.badRequest(err.message);
        }

        delete req.session.tokenSecret;

        // eslint-disable-next-line
        req.session.userId = user.twitterUserId;
        req.session.userName = user.twitterUserName;
        if (user.newUser) req.session.newUser = 1;

        return reply.redirect('/');
    });

    app.delete('/logout', (req, reply) => {
        req.destroySession(err => {
            if (err) {
                return reply.internalServerError();
            }

            return reply.send({ loggedOut: true });
        });
    });

    done();
};
