/**
 * Created by vaibhavingale on 16/11/16.
 * MONGO_URL defined in the terminal as:
 *      export PORT=6592 MONGO_URL=mongodb://dev-api.cloudwalker.tv:6592/cloudwalkerdbapp
 */

var mongoose = require('mongoose')
var fs = require('fs')
var models_path = process.cwd() + '/app/models'
var config = require(process.cwd() + '/config/global.js');

// avoid warning of depricated mogoose promise.
mongoose.Promise = global.Promise;

// connect to mongodb server
mongoose.connect(config.G_CONFIG.MONGO_URL, { 
    server: { 
        auto_reconnect: true, 
        serverSelectionTimeoutMS: 10000,
        useCreateIndex:true ,
        useFindAndModify:false ,
        useUnifiedTopology: true,
        useNewUrlParser: true 
    }
},function(err){
    if (err) {
        res.status(500);
        res.json({ data: "Error occured:" + err })
    } 
});
var db = mongoose.connection;

db.on('error', function (err) {
    console.error('MongoDB connection error:', err);
});

db.once('open', function callback() {
    console.info('MongoDB connection is established.');
});

db.on('disconnected', function () {
    console.error('MongoDB disconencted!');
    // avoid warning of depricated mogoose promise.
    mongoose.Promise = global.Promise;
    // connect to mongodb server
    mongoose.connect(config.G_CONFIG.MONGO_URL, { server: { auto_reconnect: true, serverSelectionTimeoutMS: 10000 } });
});

db.on('reconnected', function () {
    console.info('MongoDB reconnected!');
});

fs.readdirSync(models_path).forEach(function (file) {
    if (~file.indexOf('.js'))
        require(models_path + '/' + file)
});
