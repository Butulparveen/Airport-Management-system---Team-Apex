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

    //==================================================================// 
    // ******** Use only if you do not have these collections. ******** //
    //==================================================================// 
    // controllers.carousels.generateCarousels()
    // controllers.utils.generateGates()
    //==================================================================//


    controllers.utils.startCronJob()
    
    app.get({ path: "/", version: ['1.0.0'] }, function (req, res, next) {
        res.status(200);
        res.json();
    })
    
    ////// Actions for airport employee //////
    // Create terminal gates
    app.post({ path: "/createGate", version: ['1.0.0'] }, controllers.terminalgates.createGate)
    //Show all list of gates with their assignments with their status
    app.get({ path: "/listAllGates", version: ['1.0.0'] }, controllers.terminalgates.getAllGates)
    //Show all list of gates with their assignments with their status
    app.get({ path: "/listAvailableGates", version: ['1.0.0'] }, controllers.terminalgates.getAvailableGates)
    // get all assigned gates
    app.get({ path: "/getAllAssignedGates", version: ['1.0.0'] }, controllers.terminalgates.getAllAssignedGates)
    //Update gate status for maintenance
    app.post({ path: "/updateGateStatus", version: ['1.0.0'] }, controllers.terminalgates.updateGateStatus)
    app.post({ path: "/handleGateExpiry", version: ['1.0.0'] }, controllers.terminalgates.handleGatesExpiry)
    // for other screens show arrival, departure, gate assignments, for next 1,2,4 hrs
    app.get({ path: "/showGateStatus", version: ['1.0.0'] }, controllers.terminalgates.showGateStatus)


    app.post({ path: "/signup", version: ['1.0.0'] }, controllers.users.createUser)
    app.post({ path: "/login", version: ['1.0.0'] }, controllers.users.login)

    // asign baggage carousel number to arriving flights - avoid conflicting assignemnts
    app.get({ path: "/listAvailableCarousels", version: ['1.0.0'] }, controllers.carousels.listAvailableCarousels)
    // after every one half hour assigned baggage will be reset.
    app.post({ path: "/assignCarousel", version: ['1.0.0'] }, controllers.carousels.assignCarousel)
    app.get({ path: "/removeAssignedCarousel/:carousel_name", version: ['1.0.0'] }, controllers.carousels.removeAssignedCarousel)
    app.post({ path: "/handleCarouselExpiry", version: ['1.0.0'] }, controllers.carousels.handleCarouselsExpiry)
    // for arrivals show baggage claim on TV
    app.get({ path: "/showBaggageClaim", version: ['1.0.0'] }, controllers.carousels.showBaggageClaim)

    /////// Actions for airline employee ////////
    app.post({ path: "/addSchedule", version: ['1.0.0'] }, controllers.schedules.createSchedule)
    app.post({ path: "/updateSchedule", version: ['1.0.0'] }, controllers.schedules.updateSchedule)
    app.post({ path: "/getSchedule", version: ['1.0.0'] }, controllers.schedules.getScheduleByAirline)
    app.get({ path: "/displayScheduleOnTV", version: ['1.0.0'] }, controllers.schedules.getFlightsWithGateAssigned)
    app.get({ path: "/scheduleWithoutCarousel", version: ['1.0.0'] }, controllers.schedules.getFlightSchedulesWithoutCarousels)

}

setup_server(server);

server.listen(http_port, function (err) {
    if (err)
        console.error(err)
    else
        console.log('HTTP Server is ready at : ' + http_port)
})
restify.defaultResponseHeaders = function (data) {
    this.header('Server', "Apex-Airport Management System");
};
process.on('SIGINT', function () {
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
    process.exit(1);
});
restify.defaultResponseHeaders = false;