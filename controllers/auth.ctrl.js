const { twitter, streamTweets: StreamTweets } = require('../services');
const { logger } = require('../utils');
const { User } = require('../models');

const ctrl = {};
module.exports = ctrl;

ctrl.login = async () =>
    new Promise((resolve, reject) => {
        twitter.login((err, tokenSecret, url) => {
            if (err) {
                logger.error(err);
                return reject(err);
            }
            return resolve({ tokenSecret, url });
        });
    });

ctrl.twitterCallback = async (oauthToken, oauthVerifier, tokenSecret) =>
    new Promise((resolve, reject) => {
        twitter.callback(
            {
                oauth_token: oauthToken,
                oauth_verifier: oauthVerifier,
            },
            tokenSecret,
            async (err, userData) => {
                if (err) {
                    logger.error(err);
                    return reject(err);
                }

                const {
                    userId,
                    userName,
                    userToken,
                    userTokenSecret,
                } = userData;

                // await Tweet.deleteMany({});
                // await User.deleteMany({});

                let user = await User.findOne({
                    twitterUserId: userData.userId,
                });
                let newUser = false;
                if (!user) {
                    user = new User({
                        twitterUserName: userName,
                        twitterUserId: userId,
                        twitterUserToken: userToken,
                        twitteruserTokenSecret: userTokenSecret,
                    });
                    await user.save();
                    const st = new StreamTweets(
                        userId,
                        userToken,
                        userTokenSecret
                    );
                    logger.info(st);
                    newUser = true;
                }

                // INFO: twitter username can be update, so we are
                // checking if it's changed and update it in our db
                if (user.twitterUserName !== userName) {
                    user.twitterUserName = userName;
                    await user.save();
                }

                user = user.toObject();
                user.newUser = newUser;
                return resolve(user);
            }
        );
    });
