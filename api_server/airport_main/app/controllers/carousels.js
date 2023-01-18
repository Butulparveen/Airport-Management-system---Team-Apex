const mongoose = require('mongoose')
const _ = require('underscore')
const axios = require('axios');
const isEmpty = require('is-empty')
const carousels = mongoose.model("carousels")
const debug = require('debug')('dev')
const schedules = require(process.cwd() + '/app/controllers/schedules.js');
const utils = require(process.cwd() + '/app/controllers/utils.js');
const { G_CONFIG } = require('../../config/global')

// get the count of available carousels
exports.listAvailableCarousels = function (req, res, next) {
    carousels.find({ 'flightId': { $exists: false } }, '-flightId -_id -created_at -updated_at -__v',
        function (err, _carousels) {
            if (err) {
                res.status(500);
                res.json({ data: "Error occured:" + err })
            } else {
                debug(_carousels)
                const sortAlphaNum = (a, b) => a.localeCompare(b, 'en', { numeric: true })

                var carouselNames = _carousels.map(function (carousel) {
                    return carousel['carousel'];
                }).sort(sortAlphaNum);
                if (_carousels) {
                    // debug("random: "+getRandomCarousel(carouselNames))
                    res.json({ carousels: carouselNames })
                }
            }
        })
};

//TODO : check before if its arrival flight before updating..
exports.carouselupdate = async function (carouselName, flightId, callback) {
    var res = {}
    carousels.updateOne({ 'carousel': carouselName }, { $set: { 'flightId': flightId } },
        await function (err, _carousel) {
            if (err) {
                res.status = 500;
                res.data = "Error occured:" + err
            } else {
                if (_carousel.n) { // based on the updateOne response: { n: 1, nModified: 0, ok: 1 }
                    // debug(_carousel)
                    res.status = 200;
                    res.data = "successfully updated!"
                } else {
                    res.status = 403;
                    res.data = "carousel " + carouselName + " not found for updation"
                }
            }
            callback(res)
        })
}

// user will assign one of the carousel form the drop down to selected flight
exports.assignCarousel = async function (req, res, next) {
    debug(req.body)
    if (req.body != null &&
        !isEmpty(req.body.carousel) &&
        !isEmpty(req.body.flightId)) {
        await module.exports.carouselupdate(req.body.carousel, req.body.flightId, async function (_res) {
            debug("carouselupdate response :" + JSON.stringify(_res))

            await schedules.getScheduleById(req.body.flightId, async function (_resp) {
                // debug("getScheduleById response :" + _resp.data)
                let data = {}
                data.carousel = req.body.carousel
                data.flightId = req.body.flightId
                data.expiresInSec = 10
                data.expiresInSec = await utils.getExpiryInSeconds(_resp.data.estimated, parseInt(G_CONFIG.CAROUSEL_ALLOCATION_TIME))
                // data.expiresInSec = parseInt(G_CONFIG.CAROUSEL_ALLOCATION_TIME)

                // data.expiresInSec = _resp.data.estimated
                await axios.post(G_CONFIG.CACHE_SERVER_URL + '/addCarouselToCache', data)
                    .then(function (response) {
                        debug("Response from cache server : " + response.status);
                        res.status(_res.status);
                        res.json({ data: _res.data })
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
        })
    }
    else {
        res.status(403);
        res.json({ data: "Incomplete data!" })
    }
};

// user will assign one of the carousel form the drop down to selected flight
exports.removeAssignedCarousel = async function (req, res, next) {
    debug(req.params.carousel_name)
    if (req.params != null && !isEmpty(req.params.carousel_name)) {
        await carousels.updateOne(
            { 'carousel': req.params.carousel_name },
            { $unset: { 'flightId': "" } },
            function (err, _carousel) {
                if (err) {
                    res.status = 500;
                    res.json({ data: "Error occured:" + err })
                } else {
                    if (_carousel.n) { // based on the updateOne response: { n: 1, nModified: 0, ok: 1 }
                        // debug(_carousel)
                        res.status = 200;
                        res.json({ data: "successfully updated!" })
                    } else {
                        res.status = 403;
                        res.json({ data: "carousel " + req.params.carousel_name + " not found for updation" })
                    }
                }
            })
    }
    else {
        res.status(403);
        res.json({ data: "Incomplete data!" })
    }
};

// to be run at startup to make sure all carousels are empty
exports.clearAllCarousels = async function () {
    try {
        await carousels.updateMany({}, { $unset: { 'flightId': "" } },
            function (err, _carouselUpdated) {
                if (err) {
                    debug({ data: "Error occured:" + err })
                } else {
                    if (_carouselUpdated.n) { // based on the updateOne response: { n: 1, nModified: 0, ok: 1 }
                        debug("carousels cleared! ")
                        // debug(_carouselUpdated)
                    }
                }
            })
        let carouselFlightCount = await carousels.find({ 'flightId': { $exists: true } }).countDocuments()
        debug("Carousel reset count (should be 0): " + carouselFlightCount)
    } catch (error) {
        debug("error in clearAllCarousels: " + error)
    }


};

// generate 3 terminals and 32 carousels for each terminal and assign them as a avilable
exports.generateCarousels = () => {
    for (let carousel = 1; carousel <= 24; carousel++) {
        var carouselsModel = new carousels();
        carouselsModel.carousel = "BC" + carousel
        carouselsModel.save(function (err, _terminalgates) {
            if (err) {
                debug({ data: "Error occured:" + err })
            } else {
                debug("Carousels created succesfully")
            }
        })
    }
}



exports.showBaggageClaim = function (req, res, next) {

    var query = [
        { '$match': { 'flightId': { '$exists': true } } },
        { '$lookup': { 'from': 'schedules', 'localField': 'flightId', 'foreignField': '_id', 'as': 'result' } },
        { '$unwind': { 'path': '$result' } },
        { '$replaceRoot': { 'newRoot': { '$mergeObjects': ['$$ROOT', '$result'] } } },
        { '$match': { 'arriving_from': { '$ne': undefined } } },
        { '$project': { '__v': 0, 'result': 0, 'flightId': 0 } }
    ]

    debug(JSON.stringify(query,null,4))
    carousels.aggregate(query, function (err, _carousels) {
        if (err) {
            res.status(500);
            res.json({ data: "Error occured:" + err })
        } else {
            debug(_carousels)
            if (_carousels) {
                res.json({ data: _carousels })
            }
        }
    })

}
// get the count of available carousels
exports.handleCarouselsExpiry = async function (req, res, next) {
    debug(req.body)
    if (req.body != null &&
        !isEmpty(req.body.carousel) &&
        !isEmpty(req.body.flightId)) {
        await axios.get('http://localhost:9999/removeAssignedCarousel/' + req.body.carousel)
            .then(function (response) {
                res.status(200)
                res.json(response.data.data)
                // debug(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
};
