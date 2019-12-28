const { prod } = require('../config');

module.exports = app => {
    // eslint-disable-next-line
    app.register(require('fastify-nextjs'), { dev: !prod }).after(() => {
        app.next('/');
        app.next('/login');
    });
};
