const { env: ENV } = process;

const prodENV = ENV.NODE_ENV === 'production';
const config = {
    prod: prodENV,
    port: ENV.PORT || 7890,
    host: ENV.HOST || '0.0.0.0',
    sessionSecret:
        ENV.SESSION_SECRET ||
        'vmdhdf^&^sdjkd2134278389kdfnkvbnjdmklsjhfdmkbjdvhjfbfhbfhbgfhbghbgfwejk3765646',
    mongoURL:
        ENV.MONGODB_URL ||
        `mongodb+srv://twitter_toplinks_user:${encodeURIComponent(
            'simple2@123'
        )}@cluster0-coy8t.mongodb.net/test?retryWrites=true&w=majority`,
    twitter: {
        consumerKey: ENV.TWITTER_CONSUMER_KEY || '8tK43fN8hQvzusvSBncyGMyEx',
        consumerSecret:
            ENV.TWITTER_CONSUMER_SECRET ||
            'Ejzk4VDQCITCxTlz9fzB4OrkVgq86R8bIBB9REvF4UU4OJiQKP',
        callbackUrl:
            ENV.TWITTER_CB_URL ||
            `${
                prodENV
                    ? 'https://tt-links.herokuapp.com'
                    : 'http://localhost:7890'
            }/api/v1/auth/twitter/callback`,
    },
};

module.exports = config;
