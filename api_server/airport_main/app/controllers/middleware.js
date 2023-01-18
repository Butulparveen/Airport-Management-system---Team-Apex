
const cron = require('node-cron');
const axios = require('axios');
const debug = require('debug')('dev')

exports.clearCarousel = (request, response, next) => {
  // Schedule tasks to be run on the server.
  // cron.schedule('*/10 * * * * *', function() {
  cron.schedule('*/1 * * * * *', function () {
    console.log('running a task every 10 seconds: ' + Date());
    debug(assignedGatesCache.keys())
  });
};

