const Twit = require('twit');

const { twitter } = require('../config');
const { logger, sortObjectByValues } = require('../utils');
const { Tweet, User } = require('../models');

class StreamTweets {
    constructor(twitterUserId, accessToken, accessTokenSecret) {
        this.twitterUserId = twitterUserId;
        this.T = new Twit({
            consumer_key: twitter.consumerKey,
            consumer_secret: twitter.consumerSecret,
            access_token: accessToken,
            access_token_secret: accessTokenSecret,
        });

        this.sinceDate = new Date(
            new Date().getTime() - 7 * 24 * 60 * 60 * 1000 // 7 days
        );

        this.domains = {};
        this.users = {};

        this.pullTweets();
    }

    pullTweets() {
        this.T.get(
            'statuses/home_timeline',
            {
                include_entities: true,
                count: 200,
                max_id: this.maxId,
            },
            (err, tweets) => {
                if (err) {
                    this.saveTweetsData();
                    logger.error(err);
                } else {
                    this.handleTweets(tweets);
                }
            }
        );
    }

    handleTweets(tweets) {
        const len = tweets.length;
        if (!len) {
            this.saveTweetsData();
            return;
        }
        this.maxId = tweets[len - 1].id;
        const validTweets = [];

        /*eslint-disable */
        for (let i = 0; i < len; i++) {
            const tweet = tweets[i];

            logger.info(
                new Date(tweet.created_at) > this.sinceDate,
                new Date(tweet.created_at),
                this.sinceDate
            );

            if (
                !tweet.entities ||
                !tweet.entities.urls ||
                new Date(tweet.created_at) < this.sinceDate
            ) {
                continue;
            }

            if (!tweet.entities.urls.length) continue;
            tweets[i].twitterUserId = this.twitterUserId;
            tweets[i].hashtags = [];
            tweets[i].urls = [];
            tweets[i].location = tweet.place ? tweet.place.full_name : null;

            const userID = tweet.user.screen_name;
            if (this.users[userID]) {
                this.users[userID] += 1;
            } else {
                this.users[userID] = 1;
            }

            for (let j = 0; j < tweet.entities.urls.length; j++) {
                const url = tweet.entities.urls[j];
                tweets[i].urls.push({
                    url: url.url,
                    expandedURL: url.expanded_url,
                    displayURL: url.display_url,
                });
                const hostName = new URL(url.expanded_url).hostname;
                if (this.domains[hostName]) {
                    this.domains[hostName] += 1;
                } else {
                    this.domains[hostName] = 1;
                }
            }

            if (tweet.entities && tweet.entities.hashtags) {
                for (let j = 0; j < tweet.entities.hashtags.length; j++) {
                    const hashtag = tweet.entities.hashtags[j];
                    tweets[i].hashtags.push(hashtag.text);
                }
            }
            /* eslint-enable */

            validTweets.push(tweet);
        }
        this.pushToDB(validTweets);
    }

    pushToDB(tweets) {
        if (!tweets.length) {
            this.saveTweetsData();
            return;
        }
        // logger.info(`User Tweet Logs::`, this.domains, this.users);
        Tweet.insertMany(tweets, error => {
            if (error)
                logger.error(
                    `Tweets pulling api error for user:: ${this.twitterUserId}`,
                    error
                );
            else
                logger.info(
                    `${tweets.length} tweets pulled for user ${this.twitterUserId} and added to db`
                );
        });
        this.pullTweets();
    }

    saveTweetsData() {
        User.updateOne(
            { twitterUserId: this.twitterUserId },
            {
                topLinks: sortObjectByValues(this.domains),
                topUsers: sortObjectByValues(this.users),
            },
            error => {
                if (error)
                    logger.error(
                        `Tweets pulling api error for user update:: ${this.twitterUserId}`,
                        error
                    );
            }
        );
    }
}

// const st = new StreamTweets(
//     '416966472',
//     '416966472-uv4o9cmuGKtrlRX2y3AqKoU5UdByWNE2jRh2zdXA',
//     'SyEu5AeKa6KnFVoYuuw6jQ2Lonxa3R5jCWMymYpK5B6cS'
// );

module.exports = StreamTweets;
