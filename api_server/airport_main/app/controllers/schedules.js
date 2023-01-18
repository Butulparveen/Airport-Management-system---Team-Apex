var mongoose = require('mongoose');
var _ = require('underscore');
var isEmpty = require('is-empty');
const { G_CONFIG } = require('../../config/global');
var schedules = mongoose.model("schedules");
var debug = require('debug')('dev');
const utils = require(process.cwd() + '/app/controllers/utils.js');
var terminalgates = require(process.cwd() + '/app/controllers/terminalgates.js');
var carousels = require(process.cwd() + '/app/controllers/carousels.js');


exports.createSchedule = function (req, res, next) {
    var schedulesModel = new schedules();
    debug(req.body)
    if (req.body != null &&
        !isEmpty(req.body.airline) &&
        !isEmpty(req.body.flight) &&
        !isEmpty(req.body.scheduled) &&
        !isEmpty(req.body.estimated) &&
        !isEmpty(req.body.status) &&
        (!isEmpty(req.body.departing_to) && isEmpty(req.body.arriving_from)) ||
        (!isEmpty(req.body.arriving_from) && isEmpty(req.body.departing_to))) {
        schedules.findOne({ 'flight': req.body.flight, 'airline': req.body.airline }, '-created_at -updated_at -__v',
            function (err, _schedulePresent) {
                if (err) {
                    res.status(500);
                    res.json({ data: "Error occured:" + err })
                } else {
                    if (_schedulePresent) {
                        res.json({ data: "schedule already present" });
                    }
                    else if (!_schedulePresent) {
                        schedulesModel.airline = req.body.airline;
                        if (!isEmpty(req.body.departing_to)) {
                            schedulesModel.departing_to = req.body.departing_to;
                        } else if (!isEmpty(req.body.arriving_from)) {
                            schedulesModel.arriving_from = req.body.arriving_from;
                        }
                        schedulesModel.flight = req.body.flight;
                        schedulesModel.scheduled = req.body.scheduled;
                        schedulesModel.estimated = req.body.estimated;
                        schedulesModel.status = req.body.status;

                        schedulesModel.save(function (err, _schedules) {
                            if (err) {
                                res.status(500);
                                res.json({ data: "Error occured:" + err })
                            } else {
                                res.json({ data: _schedules })
                            }
                        })

                    }
                }
            })
    }
    else {
        res.status(403);
        res.json({ data: "Incomplete data!" })
    }
};


//TODO: if schedule is update, and if gate is assigned, remove that gate assignment.
exports.resetSchedule = async function (req, res, next) {
    try {
        var updateSchedule = { 'status': "On-Time" }
        let _updatedSchedule = await schedules.updateMany({}, { $set: updateSchedule })
        if (_updatedSchedule.n) {
            // debug(_updatedSchedule)
            debug("successfully reset all schedules to On-Time")
        }
        // cross check!!
        let resetCount = await schedules.find({ 'status': { $in: ['Arrived', 'Departed'] } }).countDocuments()
        debug("All schedules are marked as OnTime, reset count (should be 0): " + resetCount)

        let delayQuery = [
            {
                '$project': {
                    'scheduled': {
                        '$dateToString': {
                            'format': '%H:%M',
                            'date': '$scheduled',
                        }
                    }
                }
            }, {
                '$match': {
                    '$or': [
                        {
                            'scheduled': {
                                '$regex': '30'
                            }
                        }, {
                            'scheduled': {
                                '$regex': '50'
                            }
                        }
                    ]
                }
            }
        ]
        let delayResponse = await schedules.aggregate(delayQuery)
        delayResponse.forEach(async flight => {
            // debug(flight)
            await schedules.updateOne({ '_id': flight._id }, { $set: { 'status': 'Delayed' } })
        })

    } catch (error) {
        debug("Error occured:" + error)
    }
}

//TODO: if schedule is update, and if gate is assigned, remove that gate assignment.
exports.updateSchedule = function (req, res, next) {
    debug(req.body)
    if (req.body != null &&
        !isEmpty(req.body.airline) &&
        !isEmpty(req.body.flight) &&
        !isEmpty(req.body.scheduled) &&
        !isEmpty(req.body.estimated) &&
        !isEmpty(req.body.status) &&
        (!isEmpty(req.body.departing_to) && isEmpty(req.body.arriving_from)) ||
        (!isEmpty(req.body.arriving_from) && isEmpty(req.body.departing_to))) {
        var updateSchedule = {
            'scheduled': req.body.scheduled,
            'estimated': req.body.estimated,
            'status': req.body.status,
            'updated_at': new Date()
        }
        if (!isEmpty(req.body.departing_to)) {
            updateSchedule.departing_to = req.body.departing_to;
        } else if (!isEmpty(req.body.arriving_from)) {
            updateSchedule.arriving_from = req.body.arriving_from;
        }
        schedules.updateOne({ 'flight': req.body.flight, 'airline': req.body.airline }, { $set: updateSchedule },
            async function (err, _updatedSchedule) {
                if (err) {
                    res.status(500);
                    res.json({ data: "Error occured:" + err })
                } else {
                    if (_updatedSchedule.n) { // based on the updateOne response: { n: 1, nModified: 0, ok: 1 }
                        debug(_updatedSchedule)
                        query = { 'flight': req.body.flight, 'airline': req.body.airline }
                        let flightID = await schedules.findOne(query, '-created_at -updated_at -__v');
                        debug(flightID);
                        let isUpdated = await terminalgates.removeFlightFromGateWithoutDone(flightID);
                        debug("isupdated?" + isUpdated)
                        // TODO: remove carousel as well if assigned.
                        res.json({ data: "successfully updated" });
                    } else {
                        res.status(403);
                        res.json({ data: "flight " + req.params.flight + " & airline " + req.params.airline + " not found for updation" })
                    }
                }
            })
    }
    else {
        res.status(403);
        res.json({ data: "Incomplete data!" })
    }

};

exports.getScheduleByAirline = async function (req, res, next) {
    debug(req.body)
    if (!isEmpty(req.body)) {
        let query = []
        if (!isEmpty(req.body.airline)) {
            query.push({
                '$match': {
                    'airline': { $regex: '^' + req.body.airline + '$' }
                }
            })
        }
        if (!isEmpty(req.body.flow)) {
            if (req.body.flow == "arrivals") {
                query.push({
                    '$match': {
                        'arriving_from': { $ne: null }
                    }
                })
            }
            if (req.body.flow == "departures") {
                query.push({
                    '$match': {
                        'departing_to': { $ne: null }
                    }
                })
            }
        }

        if (!isEmpty(req.body.forNextHours)) {
            if (req.body.forNextHours > 0) {
                query.push({
                    '$match': {
                        'estimated': {
                            '$gte': utils.getCurrentDateTime(),
                            '$lt': utils.getCurrentDateTime(req.body.forNextHours)
                        }
                    }
                })
            }
        } else {
            query.push({
                '$match': {
                    'estimated': {
                        '$gte': utils.getCurrentDateTime(),
                        '$lt': utils.getCurrentDateTime(24)
                    }
                }
            })
        }
        let projection = {
            '$project': {
                '_id': 1,
                'flight': 1,
                'airline': 1,
                'arriving_from': 1,
                'departing_to': 1,
                'status': 1,
                'scheduled': { $dateToString: { format: "%H:%M", date: "$scheduled", timezone: 'America/Los_Angeles' } },
                'estimated': { $dateToString: { format: "%H:%M", date: "$estimated", timezone: 'America/Los_Angeles' } },
            }
        }


        query.push(projection)
        // keep this line as its required to convert full query into object
        debug(JSON.stringify(query, null, 4))
        await schedules.aggregate(query, function (err, _schedules) {
            if (err) {
                res.status(500);
                res.json({ data: "Error occured:" + err })
            } else {
                // debug(_schedules)
                if (_schedules) {
                    res.json({ data: _schedules })
                }
            }
        })
    }
    else {
        res.status(403);
        res.json({ data: "Incomplete data!" })
    }
};

exports.getScheduleById = async function (flightId, callback) {
    var res = {};
    // debug(flightId)
    if (!isEmpty(flightId)) {
        query = { "_id": flightId }
        await schedules.findOne(query, '-created_at -updated_at -__v',
            function (err, _schedules) {
                if (err) {
                    res.code = 500;
                    res.err = "Error occured:" + err
                    callback(res)
                } else {
                    // debug(_schedules.scheduled)
                    res.code = 200;
                    res.data = _schedules
                    callback(res)
                }
            })
    }
    else {
        res.code = 403;
        res.err = "Incomplete data!"
        callback(res)
    }
};
exports.markFlightAsDone = async function (flightId, callback) {
    // Step 1: find if flight is arrival or departure
    await module.exports.getScheduleById(flightId, async function (_resp) {
        debug("getScheduleById response :" + _resp.data)
        var updateStatus = {}
        // Step 2: if arrival mark it as Arrived, if departure mark it as Departed.
        if (!isEmpty(_resp.data.departing_to)) {
            updateStatus = {
                'status': "Departed",
                'updated_at': new Date()
            }
        }
        if (!isEmpty(_resp.data.arriving_from)) {
            updateStatus = {
                'status': "Arrived",
                'updated_at': new Date()
            }
        }
        // debug(updateStatus)
        await schedules.updateOne({ '_id': flightId }, { $set: updateStatus },
            function (err, _updatedSchedule) {
                if (err) {
                    debug({ data: "Error occured:" + err })
                } else {
                    if (_updatedSchedule.n) { // based on the updateOne response: { n: 1, nModified: 0, ok: 1 }
                        debug(_updatedSchedule)
                        debug({ data: "successfully updated" });
                        callback(true);
                    } else {
                        debug({ data: "flight " + flightId + " not found for updation" })
                        callback(false);
                    }
                }
            })
    });

};

// generate 3 terminals and 32 gates for each terminal and assign them as a avilable
exports.getNextFlightsForGateAssignment = async function (forNextHours, callback) {
    var timeUpto;
    if (forNextHours >= 1 && forNextHours <= 4) {
        timeUpto = await utils.getCurrentDateTime(forNextHours)
    } else {
        timeUpto = await utils.getCurrentDateTime(4)    // default 4 hrs
    }

    query = [
        { '$match': { 'status': { '$nin': ['Departed', 'Arrived', 'Cancelled', 'Departing', 'Last Call'] } } },
        { '$match': { 'estimated': { '$gte': await utils.getCurrentDateTime(-1), '$lt': timeUpto } } },
        { '$lookup': { 'from': 'terminalgates', 'localField': '_id', 'foreignField': 'flight', 'as': 'result' } },
        { '$match': { '$expr': { '$not': { '$in': ['$_id', '$result.flight'] } } } },
        { '$project': { '_id': 1, 'estimated': 1, } },
        { '$sort': { 'estimated': 1, _id: 1 } },
        { '$limit': parseInt(G_CONFIG.NUMBER_OF_GATES) },
    ]
    // debug(JSON.stringify(query, null, 4))
    await schedules.aggregate(query, async function (err, _schedules) {
        if (err) {
            debug({ data: "Error occured:" + err })
        } else {
            debug("number of scheduled flights with : " + _schedules.length)
            // debug("list of scheduled flights : " + JSON.stringify(_schedules, null, 4))
            callback(_schedules)
        }
    })

}

// list of all flights to which gate is assigned
exports.getFlightsWithGateAssigned = async function (req, res, next) {

    query = [
        { '$match': { 'status': { '$nin': ['Arrived', 'Departed', 'Cancelled', 'Arriving', 'Departing', 'Last Call'] } } },
        { '$sort': { 'estimated': 1 } },
        { '$lookup': { 'from': 'terminalgates', 'localField': '_id', 'foreignField': 'flight', 'as': 'result' } },
        { '$match': { '$expr': { '$in': ['$_id', '$result.flight'] } } },
        { '$unwind': { 'path': '$result' } },
        { '$replaceRoot': { 'newRoot': { '$mergeObjects': ['$$ROOT', '$result'] } } },
        {
            '$project':
            {
                "_id": 1,
                "airline": 1,
                "departing_to": 1,
                "arriving_from": 1,
                "flight": 1,
                "status": 1,
                "terminal": 1,
                "gate": 1,
                'scheduled': { $dateToString: { format: "%H:%M", date: "$scheduled", timezone: 'America/Los_Angeles' } },
                'estimated': { $dateToString: { format: "%H:%M", date: "$estimated", timezone: 'America/Los_Angeles' } },
            }
        },
        { '$sort': { 'estimated': 1 } },
    ]
    debug(JSON.stringify(query, null, 4))
    await schedules.aggregate(query, function (err, _schedules) {
        if (err) {
            res.code = 500;
            res.err = "Error occured:" + err
        } else {
            // debug(_schedules)
            res.code = 200;
            res.json({ data: _schedules })
        }
    })

}


// list of all flights to which gate is assigned
exports.getFlightSchedulesWithoutCarousels = async function (req, res, next) {

    query = [
        {
            '$lookup': {
                'from': 'carousels',
                'localField': '_id',
                'foreignField': 'flightId',
                'as': 'result'
            }
        }, {
            '$match': {
                'arriving_from': {
                    '$exists': true
                }
            }
        }, {
            '$match': {
                '$expr': {
                    '$not': {
                        '$in': [
                            '$_id', '$result.flightId'
                        ]
                    }
                }
            }
        }, {
            '$match': {
                'estimated': {
                    '$gte': await utils.getCurrentDateTime(),
                    '$lt': await utils.getCurrentDateTime(4)
                }
            }
        }, {
            '$sort': {
                'estimated': 1
            }
        }, {
            '$project': {
                '_id': 1,
                'airline': 1,
                'arriving_from': 1,
                'flight': 1,
                'status': 1,
                'scheduled': {
                    '$dateToString': {
                        'format': '%H:%M',
                        'date': '$scheduled',
                        'timezone': 'America/Los_Angeles'
                    }
                },
                'estimated': {
                    '$dateToString': {
                        'format': '%H:%M',
                        'date': '$estimated',
                        'timezone': 'America/Los_Angeles'
                    }
                }
            }
        }
    ]
    // debug(JSON.stringify(query, null, 4))
    await schedules.aggregate(query, function (err, _schedules) {
        if (err) {
            res.code = 500;
            res.err = "Error occured:" + err
        } else {
            debug(_schedules)
            res.code = 200;
            res.json({ data: _schedules })
        }
    })

}

