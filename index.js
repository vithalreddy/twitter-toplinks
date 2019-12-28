const fastify = require('fastify');
const fastifySession = require('fastify-session');
const fastifyCookie = require('fastify-cookie');
const MongoDBStore = require('connect-mongodb-session')(fastifySession);

const registerRoutes = require('./routes');
const registerMiddlewares = require('./middlewares');

const { logger } = require('./utils');
const {
    port,
    host,
    sessionSecret,
    prod: prodEnv,
    mongoURL,
} = require('./config');
const { mongodb, next: registerNextRoutes } = require('./services');

const server = fastify({ logger, ignoreTrailingSlash: true });
server.register(require('fastify-sensible'));

const store = new MongoDBStore({
    uri: mongoURL,
    collection: 'ttSessions',
});

server.register(fastifyCookie);
server.register(fastifySession, {
    secret: sessionSecret,
    saveUninitialized: false,
    expires: 6.048e8, // 7 days
    cookieName: 'TT-SESSION',
    cookie: { secure: prodEnv, httpOnly: prodEnv },
    store,
});
server.register(require('fastify-url-data'));

registerMiddlewares(server);
registerRoutes(server);
registerNextRoutes(server);

const start = async () => {
    try {
        await mongodb();
        await server.listen(port, host);
    } catch (err) {
        logger.error(err);
        process.exit(1);
    }
};
start();
