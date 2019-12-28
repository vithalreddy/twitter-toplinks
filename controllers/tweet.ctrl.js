const { User, Tweet } = require('../models');

const ctrl = {};
module.exports = ctrl;

ctrl.all = async (twitterUserId, hashTags = [], location = '') => {
    const query = { twitterUserId };

    if (Array.isArray(hashTags) && hashTags.length) {
        const hashTagsRegexp = [];
        hashTags.forEach(opt => {
            hashTagsRegexp.push(new RegExp(opt, 'i'));
        });

        // query.hashtags = {
        //     $in: hashTagsRegexp,
        // };
        query.hashtags = {
            $all: hashTagsRegexp,
        };
    }

    if (location) {
        query.location = new RegExp(location, 'i');
    }

    const tweetsPromise = Tweet.find(query).lean();
    const userInfoPromise = User.findOne(
        {
            twitterUserId,
        },
        '-twitterUserToken -twitteruserTokenSecret -__v'
    ).lean();
    const [tweets, user] = await Promise.all([tweetsPromise, userInfoPromise]);
    return { tweets, user };
};
