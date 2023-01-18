const axios = require('axios');
var mongoose = require('mongoose')
var _ = require('underscore')
var isEmpty = require('is-empty')
const { G_CONFIG } = require('../../config/global')
var terminalgates = mongoose.model("terminalgates")
var debug = require('debug')('dev')
var warn = require('debug')('warn')
var config = require(process.cwd() + '/config/global.js');
var utils = require(process.cwd() + '/app/controllers/utils.js');
var schedules = require(process.cwd() + '/app/controllers/schedules.js');
var carousels = require(process.cwd() + '/app/controllers/carousels.js');


exports.createGate = function (req, res, next) {
    var terminalgatesModel = new terminalgates();
    debug(req.body)
    if (req.body != null &&
        !isEmpty(req.body.terminal) &&
        !isEmpty(req.body.gate)) {
        terminalgates.findOne({ 'terminal': req.body.terminal, 'gate': req.body.gate }, '-created_at -updated_at -__v',
            function (err, _terminalgatePresent) {
                if (err) {
                    res.status(500);
                    res.json({ data: "Error occured:" + err })
                } else {
                    if (_terminalgatePresent) {
                        res.status(200);
                        res.json({ data: "terminalgate already present" });
                    }
                    else if (!_terminalgatePresent) {
                        terminalgatesModel.terminal = req.body.terminal;
                        terminalgatesModel.gate = req.body.gate;
                        terminalgatesModel.isUnderMaintainance = false;
                        terminalgatesModel.save(function (err, _terminalgates) {
                            if (err) {
                                res.status(500);
                                res.json({ data: "Error occured:" + err })
                            } else {
                                res.json({ data: _terminalgates })
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

exports.getAllGates = function (req, res, next) {
    query = {}
    terminalgates.find(query, '-created_at -updated_at -__v',
        function (err, _terminalgates) {
            if (err) {
                debug("Error occured:" + err)
            } else {
                debug(_terminalgates)
                res.json(_terminalgates)
            }
        })

};

exports.getAllAssignedGates = function (req, res, next) {
    query = { 'flight': { $exists: true } }
    terminalgates.find(query, '-created_at -updated_at -__v',
        function (err, _terminalgates) {
            if (err) {
                debug("Error occured:" + err)
            } else {
                // debug(_terminalgates)
                res.json(_terminalgates)
            }
        })

};

exports.getAvailableGates = function (req, res, next) {
    query = { 'isUnderMaintainance': false, 'flight': { $exists: false } }
    terminalgates.find(query, '-created_at -updated_at -__v',
        function (err, _terminalgates) {
            if (err) {
                debug("Error occured:" + err)
            } else {
                res.json(_terminalgates)
            }
        })
};

exports.updateGateStatus = function (req, res, next) {
    debug(req.body)
    if (req.body != null &&
        !isEmpty(req.body.gate) &&
        !isEmpty(req.body.isUnderMaintainance) &&
        req.body.isUnderMaintainance == true || req.body.isUnderMaintainance == false) {
        terminalgates.updateOne(
            {
                'gate': req.body.gate
            },
            {
                $set:
                {
                    'isUnderMaintainance': req.body.isUnderMaintainance
                },
                $unset:
                {
                    'flight': ""
                }
            },
            function (err, _updatedterminalgate) {
                if (err) {
                    res.status(500);
                    res.json({ data: "Error occured:" + err })
                } else {
                    if (_updatedterminalgate.n) { // based on the updateOne response: { n: 1, nModified: 0, ok: 1 }
                        debug(_updatedterminalgate)
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
        res.json({ data: "Incomplete/Invalid data!" })
    }

    // TODO: if this gate is assigned to any flight then remove that flight.
};

exports.clearAllGates = async function clearAllGates() {
    try {
        let _updatedterminalgate = await terminalgates.updateMany({}, { $unset: { 'flight': "" } })
        if (_updatedterminalgate.n) { // based on the updateOne response: { n: 1, nModified: 0, ok: 1 }
            debug("All flights removed from all gates")
        }
        let gatesFlightCount = await terminalgates.find({ 'flightId': { $exists: true } }).countDocuments()
        debug("Gate reset count (should be 0): " + gatesFlightCount)

    } catch (error) {
        console.error(error)
    }
};

exports.showGateStatus = async function (req, res, next) {
    query = [
        { '$match': { 'status': { '$nin': ['Arrived', 'Departed', 'Cancelled', 'Arriving', 'Departing', 'Last Call'] } } },
        { '$match': { 'flight': { '$exists': true } } },
        { '$lookup': { 'from': 'schedules', 'localField': 'flight', 'foreignField': '_id', 'as': 'result' } },
        { '$unwind': { 'path': '$result' } },
        { '$replaceRoot': { 'newRoot': { '$mergeObjects': ['$$ROOT', '$result'] } } },
        {
            '$project':
            {
                'flight': 1,
                'airline': 1,
                'terminal': 1,
                'departing_to': 1,
                'arriving_from': 1,
                'gate': 1,
                'scheduled': { $dateToString: { format: "%H:%M", date: "$scheduled", timezone: 'America/Los_Angeles' } },
                'estimated': { $dateToString: { format: "%H:%M", date: "$estimated", timezone: 'America/Los_Angeles' } },
                'isUnderMaintainance': 1,
                'status': 1
            }
        },
        { '$sort': { 'estimated': 1, _id: 1 } },
    ]
    // keep this line as its required to convert full query into object
    // debug(JSON.stringify(query, null, 4))
    await terminalgates.aggregate(query, function (err, _terminalgates) {
        if (err) {
            res.status(500);
            res.json({ data: "Error occured:" + err })
        } else {
            // debug(_terminalgates)
            if (_terminalgates) {
                res.json({ data: _terminalgates })
            }
        }
    })

}

// remove assigned gate from flight and mark the flight as done.
exports.removeFlightFromGate = async function (gate, flightId, callback) {
    await terminalgates.updateOne({ 'gate': gate }, { $unset: { 'flight': 1 } },
        async function (err, _updatedterminalgate) {
            if (err) {
                debug({ data: "Error occured:" + err })
                callback(false)
            } else {
                if (_updatedterminalgate.n) { // based on the updateOne response: { n: 1, nModified: 0, ok: 1 }
                    // debug("flight removed from gate: " + _updatedterminalgate)
                    await schedules.markFlightAsDone(flightId, function (response) {
                        debug("ret value : " + response)
                        callback(response)
                    });

                }
            }
        })
};

// remove assigned gate from flight and mark the flight as done.
exports.removeFlightFromGateWithoutDone = async function (flightId) {
    query = { 'flight': flightId }
    let gate_id = await terminalgates.find(query)
    let update = await terminalgates.updateOne({ 'gate': gate_id.gate }, { $unset: { 'flight': 1 } })
    debug("update return value : >>")
    debug(update)
    debug(update.n)
    return update.n;
};

async function getRandomAvailableGates() {
    query = { 'isUnderMaintainance': false, 'flight': { $exists: false } }
    try {
        let gatesResp = await terminalgates.find(query, '-created_at -updated_at -__v')
        var gateNames = gatesResp.map(function (gate) { return gate['gate'] });
        let gates = Array.from(gateNames);
        // debug(gates)
        var randomGate = await gates[Math.floor(Math.random() * gates.length)];
        // debug("Random gate: " + randomGate)
        return randomGate;
    } catch (err) {
        console.log(err);
    }
}

exports.assignFlightToGate = async function () {
    //#####>>>> 1. get list of all flights which need to be scheduled
    try {
        await schedules.getNextFlightsForGateAssignment(4, async function (flightSchedules) {
            if (isEmpty(flightSchedules)) {
                debug("No flights found for assigning gates!")
                return;
            } else {
                debug(flightSchedules.length + " flights for which gate needs to assigned : ")
                debug("list of scheduled flights : " + JSON.stringify(flightSchedules, null, 4))

                //#####>>>> 2. loop till all flights
                    let count = 0;
                    for await (const _flight of flightSchedules){
                    debug("flight :" + _flight._id)
                    randomGate = await getRandomAvailableGates()
                    if (isEmpty(randomGate) || isEmpty(_flight._id)) {
                        debug("Breaking the loop because am running out of gates to assignin [" + randomGate + "] or no schedules[" + _flight._id + "] to map!")
                        return;
                    }
                    debug(count++ + "). [Gate,Flight] = [" + randomGate + "," + _flight._id + "]")
                    query = { 'gate': randomGate }
                    update = { $set: { 'flight': _flight._id } }
                    // debug("query: " + JSON.stringify(query, null, 4))
                    // debug("update: " + JSON.stringify(update, null, 4))
                    let _updatedterminalgate = await terminalgates.updateOne(query, update)
                    if (_updatedterminalgate.n) { // based on the updateOne response: { n: 1, nModified: 0, ok: 1 }
                        debug("Succesfully updates gates to flights")
                        //#####>>>> 5. update cache with gate and flight
                        let data = {}
                        data.gate = randomGate
                        data.flightId = _flight._id
                        // data.expiresInSec = parseInt(G_CONFIG.GATE_ALLOCATION_TIME)
                        data.expiresInSec = await utils.getExpiryInSeconds(_flight.estimated, parseInt(G_CONFIG.GATE_ALLOCATION_TIME))
                        await axios.post(G_CONFIG.CACHE_SERVER_URL + '/addGateToCache', data)
                            .then(function (response) {
                                debug("Response from cache server : " + response.status);
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }
                }

            }


        })
    } catch (error) {
        debug("try caught this error: " + error)
    }

}

// get the count of available carousels
exports.handleGatesExpiry = async function (req, res, next) {
    debug("I got this from cache !!")
    debug(req.body)
    if (req.body != null &&
        !isEmpty(req.body.gate) &&
        !isEmpty(req.body.flightId)) {
        await module.exports.removeFlightFromGate(req.body.gate, req.body.flightId, async function (response) {
            if (response) {
                debug("Flight sucessfully removed from gates db and marked as done(Arrived/Departed)")
                res.status(200)
                res.json({ status: response })
                await module.exports.assignFlightToGate()

            } else {
                warn("Something went wrong!!")
                res.status(403)
            }
        })
    }
};
