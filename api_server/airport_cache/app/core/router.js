const restify = require('restify')
const fs = require('fs')
const morgan = require('morgan')
const debug = require('debug')('dev')
var config = require(process.cwd() + '/config/global.js');
var controllers = {}
var controllers_path = process.cwd() + '/app/controllers'
fs.readdirSync(controllers_path).forEach(function (file) {
    if (file.indexOf('.js') != -1) {
        controllers[file.split('.')[0]] = require(controllers_path + '/' + file)
    }
})

// const cron = require('node-cron');

morgan.token('reqHeader', function (req, res) { return JSON.stringify(req.headers) })
morgan.token('reqBody', function (req, res) { return JSON.stringify(req.body) })
morgan.token('reqIp', function (req, res) { return (req.headers['x-forwarded-for'] || req.connection.remoteAddress).replace(/^.*:/, '') })
morgan.token('resBody', function (req, res) { return JSON.stringify(res.type) })
morgan.token('date', (req, res) => { return moment().tz('Asia/Calcutta').format() })

var server = restify.createServer({
    name: 'Apex-AMS',
    version: '1.0.0',
    spdy: null,
    handleUpgrades: false,
});

var http_port = config.G_CONFIG.HTTP_PORT || 3000;
debug("Server Path: " + process.cwd())

var setup_server = function (app) {
    app.use(morgan('tiny'));
    app.use(restify.acceptParser(server.acceptable))
    app.use(restify.CORS())
    app.use(restify.fullResponse())
    app.use(restify.bodyParser())
    app.use(restify.queryParser())
    app.pre(restify.pre.sanitizePath())

    controllers.utils.startCronJob()
    app.post({ path: "/addGateToCache", version: ['1.0.0'] }, controllers.terminalgates.addGateToCache)
    app.post({ path: "/addCarouselToCache", version: ['1.0.0'] }, controllers.carousels.addCarouselToCache)

}

setup_server(server);
server.listen(http_port, function (err) {
    if (err)
        console.error(err)
    else
        console.log('HTTP Server is ready at : ' + http_port)
})
restify.defaultResponseHeaders = function (data) {
    this.header('Server', "Apex-Airport Management CACHE System");
};
restify.defaultResponseHeaders = false;