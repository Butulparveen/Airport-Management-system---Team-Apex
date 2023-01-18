const isEmpty = require('is-empty')
const axios = require('axios');
const debug = require('debug')('dev')
const { G_CONFIG } = require('../../config/global')

exports.addCarouselToCache = async function (req, res, next) {
    debug(req.body)
    if (req.body != null && !isEmpty(req.body.carousel) && !isEmpty(req.body.flightId) && !isEmpty(req.body.expiresInSec)) {
        debug("i got " + req.body.carousel + " " + req.body.flightId + " " + req.body.expiresInSec)
        if (G_CONFIG.assignedCarouselCache.has(req.body.carousel)) {
            success = G_CONFIG.assignedCarouselCache.ttl(req.body.carousel, req.body.expiresInSec)
            if (success) {
                res.status(200);
                res.json({ status: "updated" })
            }
        } else {
            success = G_CONFIG.assignedCarouselCache.set(req.body.carousel, req.body.flightId, req.body.expiresInSec)
            if (success) {
                res.status(200);
                res.json({ status: "added" })
            }
        }
        if (!success) {
            if (success) {
                res.status(403);
                res.json({ status: success })
            }
        }
    }
    else {
        res.status(403);
        res.json({ data: "Incomplete data!" })
    }
};

G_CONFIG.assignedCarouselCache.on("set", function (key, value) {
    debug("Added key : [ " + key + ", " + value + " ]from cache")
    debug("Carousel CACHE = " + G_CONFIG.assignedCarouselCache.keys())
});
G_CONFIG.assignedCarouselCache.on("del", function (key, value) {
    // we will not delete any key directly from the cache, instead we will set the expiry as 1 second,
    // because we get the events as delete first then expires, so we will not able to diffrentiate 
    // between expired and deleted
    debug("Deleted key : [ " + key + ", " + value + " ]from cache")
    debug("Carousel CACHE = " + G_CONFIG.assignedCarouselCache.keys())
});

G_CONFIG.assignedCarouselCache.on("expired", async function (key, value) {
    debug("Expired key : [ " + key + ", " + value + " ]from cache")
    debug("Carousel CACHE = " + G_CONFIG.assignedCarouselCache.keys())

    let data = {}
    data.carousel = key
    data.flightId = value
    await axios.post(G_CONFIG.AIRLINE_SERVER_URL + '/handleCarouselExpiry', data)
        .then(function (response) {
            if (response.status == 200) {
                debug("Carousel expiry handled!")
            }
            // debug(response);
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
              }
            //   console.log(error.config);
        });
});