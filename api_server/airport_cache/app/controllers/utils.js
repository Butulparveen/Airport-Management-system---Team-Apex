const cron = require('node-cron');
const info = require('debug')('info')
const debug = require('debug')('dev')
const { G_CONFIG } = require('../../config/global')

exports.startCronJob = async function () {
  G_CONFIG.assignedCarouselCache.flushAll()
  G_CONFIG.assignedGatesCache.flushAll();

  cron.schedule('*/10 * * * * *', async function () {
    info('running a task every 10 seconds: ' + Date());
    info("Carousel CACHE = " + G_CONFIG.assignedCarouselCache.keys())
    info("Gates CACHE = " + G_CONFIG.assignedGatesCache.keys())
  });
}