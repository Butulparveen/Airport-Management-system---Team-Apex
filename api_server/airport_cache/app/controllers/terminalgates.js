const isEmpty = require('is-empty')
const axios = require('axios');
const debug = require('debug')('dev')
const { G_CONFIG } = require('../../config/global')

exports.addGateToCache = async function (req, res, next) {
    debug(req.body)
    if (req.body != null && !isEmpty(req.body.gate) && !isEmpty(req.body.flightId) && !isEmpty(req.body.expiresInSec)) {
        debug("i got " + req.body.gate + " " + req.body.flightId + " " + req.body.expiresInSec)
        if (G_CONFIG.assignedGatesCache.has(req.body.gate)) {
            success = G_CONFIG.assignedGatesCache.ttl(req.body.gate, req.body.expiresInSec)
            if (success) {
                res.status(200);
                res.json({ status: "updated" })
            }
        } else {
            success = G_CONFIG.assignedGatesCache.set(req.body.gate, req.body.flightId, req.body.expiresInSec)
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

G_CONFIG.assignedGatesCache.on("set", function (key, value) {
    debug("Added key : [ " + key + ", " + value + " ]from cache")
    debug("Carousel CACHE = " + G_CONFIG.assignedGatesCache.keys())
});

G_CONFIG.assignedGatesCache.on("del", function (key, value) {
    // we will not delete any key directly from the cache, instead we will set the expiry as 1 second,
    // because we get the events as delete first then expires, so we will not able to diffrentiate 
    // between expired and deleted
    debug("Deleted key : [ " + key + ", " + value + " ]from cache")
    debug("Carousel CACHE = " + G_CONFIG.assignedGatesCache.keys())
});
G_CONFIG.assignedGatesCache.on("expired", async function (key, value) {
    debug("Expired key : [ " + key + ", " + value + " ]from cache")
    debug("Carousel CACHE = " + G_CONFIG.assignedGatesCache.keys())


    let data = {}
    data.gate = key
    data.flightId = value
    await axios.post(G_CONFIG.AIRLINE_SERVER_URL + '/handleGateExpiry', data)
        .then(function (response) {
            debug(response);
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