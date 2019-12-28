const { exportDirFiles } = require('../utils');

const routes = exportDirFiles(__dirname);

module.exports = app => {
    app.register(routes.auth, { prefix: '/api/v1/auth' });
    app.register(routes.tweet, { prefix: '/api/v1/tweets' });
};
