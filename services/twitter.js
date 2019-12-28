const LoginWithTwitter = require('login-with-twitter');

const { twitter: twitterConfig } = require('../config');

const twitter = new LoginWithTwitter({
    consumerKey: twitterConfig.consumerKey,
    consumerSecret: twitterConfig.consumerSecret,
    callbackUrl: twitterConfig.callbackUrl,
});

module.exports = twitter;
