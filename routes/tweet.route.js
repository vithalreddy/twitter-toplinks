const { tweet: tweetCtrl } = require('../controllers');

module.exports = (app, opts, done) => {
    app.post('/', async (req, reply) => {
        const { location, hashTags } = req.body;

        const [err, { tweets, user }] = await app.to(
            tweetCtrl.all(req.session.userId, hashTags, location)
        );

        if (err) {
            return reply.badRequest(err.message);
        }
        return reply.send({ tweets, user, isNewUser: req.isNewUser });
    });

    done();
};
