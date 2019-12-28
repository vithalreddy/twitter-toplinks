const { exportDirFiles } = require('../utils');

const middlewares = exportDirFiles(__dirname);

module.exports = app => {
    middlewares.auth(app);
};
