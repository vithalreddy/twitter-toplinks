const mongoose = require('mongoose');
const { mongoURL } = require('../config');
const { logger } = require('../utils');

mongoose.set('useCreateIndex', true);

module.exports = async () => {
    const connection = await mongoose.connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    logger.info(`MongoDB connection Successful :).`);
    return connection;
};
