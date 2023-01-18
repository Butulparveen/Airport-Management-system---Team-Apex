const axios = require('axios');
const { G_CONFIG } = require('../../config/global');
const cron = require('node-cron');
const debug = require('debug')('dev')
const info = require('debug')('dev:info')
var terminalgates = require(process.cwd() + '/app/controllers/terminalgates.js');
var carousels = require(process.cwd() + '/app/controllers/carousels.js');
var config = require(process.cwd() + '/config/global.js');
var schedules = require(process.cwd() + '/app/controllers/schedules.js');


exports.startCronJob = async function () {
  await schedules.resetSchedule()
  await terminalgates.clearAllGates()
  await carousels.clearAllCarousels()
  await terminalgates.assignFlightToGate()
  
  // schedules.getNextFlightsForGateAssignment(1);
  // schedules.markFlightAsDone("636f003c8cfcb325381ec053"); // departure
  // schedules.markFlightAsDone("636f004b8cfcb325381ec1be"); // arrivals
  // debug(await module.exports.getExpiryInSeconds("2022-11-11T20:00:00.000-08:00", 60))

  cron.schedule('*/30 * * * *', async function () {
    // call flight assignemnt every 30 mins if no previous flights are assigned.
    await module.exports.assignFlightToGate()
  });
}

exports.getCurrentDateTime = function (addedHours) {
  // var currentTime = new Date();
  // var dateStr = G_CONFIG.CURRENT_DATE + currentTime.toLocaleTimeString('en-Gb', { hour12: false }) + ".000+00:00"
  // debug("Modified Date: " + dateStr)
  // var currentDate = new Date(dateStr);
  let us_date_string = new Date().toLocaleString("en-US", { timeZone: 'America/Los_Angeles' });

  var currentDate = new Date(us_date_string)
  debug("Current Date is : " + currentDate)
  if (addedHours >= 1 && addedHours <= 24) {
    currentDate.setTime(currentDate.getTime() + (addedHours * 60 * 60 * 1000))
  }
  return currentDate;
}


exports.getExpiryInSeconds = async function (scheduledTime, expirationDurationInSeconds) {
  var currentTS = await module.exports.getCurrentDateTime()
  var scheduledTS = new Date(scheduledTime);
  debug("===> current   time  : " + currentTS)
  debug("===> scheduled time  : " + scheduledTS)
  debug("===> expiry time     : " + expirationDurationInSeconds)
  scheduledTS.setTime(scheduledTS.getTime() + (expirationDurationInSeconds * 1000));
  debug("===> expiryTS  time  : " + scheduledTS)
  var actualExiprationDurationFromNow = (scheduledTS - currentTS) / 1000
  debug("===> Actual T in sec : " + actualExiprationDurationFromNow + " seconds")
  return actualExiprationDurationFromNow;
}

// generate 3 terminals and 32 gates for each terminal and assign them as a avilable
exports.generateGates = async () => {
  for (let terminal = 1; terminal <= 3; terminal++) {
    for (let gate = 1; gate <= 5; gate++) {
      let data = {}
      data.terminal = "T" + terminal
      data.gate = "T" + terminal + "G" + gate
      data.flight = undefined
      await axios.post('http://localhost:9999/createGate', data)
        .then(function (response) {
          debug(response);
        })
        .catch(function (error) {
          warn(error);
        });
    }
  }
}
