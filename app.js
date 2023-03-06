const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware')
global.session = require('restify-session')({ debug: true, ttl: 172800 });
const path = require('path');
const config = require(path.join(__dirname, '/config/config'));
global.log = require(path.join(__dirname, '/log'));
const dbConnection = require(path.join(__dirname, '/db-connection'));
const customErrors = require('restify-errors');

global.secret = { password: '', salt: '' };

const models = require(path.join(__dirname, '/app/models/'));
const routes = require(path.join(__dirname, '/app/routes/'));

// CONNECT TO DB
dbConnection();

// INITIALIZE SERVER INSTANCE
const server = restify.createServer({
	name: config.app.name,
	log: log
});

// APPLY MIDDLEWARES
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.gzipResponse());
server.pre(restify.pre.sanitizePath());
server.use(session.sessionManager);

const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    origins: ['*'],
    allowHeaders: ['session-id', 'auth-token'],
    exposeHeaders: ['session-id-expiry','session-id']
});

server.pre(cors.preflight);
server.use(cors.actual);

server.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    return next();
});

server.on('uncaughtException', function(req, res, route, err) {
    log.info('******* Begin Error *******\n%s\n*******\n%s\n******* End Error *******', route, err.stack);
    if (!res.headersSent) {
        return res.send(500, {
            ok: false
        });
    }
    res.write('\n');
    res.end();
});

process.on('uncaughtException', (error) => {
    log.error(error);
});

models();
routes(server);

server.get('/', function(req, res, next) {
    res.send(config.app.name);
    return next();
});

server.listen(config.app.port, function() {
    log.info('Application %s listening at %s:%s', config.app.name, config.app.address, config.app.port);
});