var mongoose = require("mongoose");

var Schema = mongoose.Schema;

/**
 * Problem Defination : 
 * Implement a Random Gate assignment for Arriving and Departing flights 
 *  - designed to prevent conflicting assignments 
 *  - allow for an hour for each flight to be at the gate (for arrivals and for departures)
 * Assumption : random gate assignemnt is specified not random gate and random terminal, 
 *              so we will assigne only based on gates which includes terminals as well
 */

var terminalgatesSchema = new Schema({
    "terminal": {
        "type": "string",
        uppercase: true
    },
    "gate": {
        "type": "string",
        unique: true,
        uppercase: true,
        index: true
    },
    "isUnderMaintainance": {
        "type": "boolean"
    },
    "flight": {
        "type": Schema.Types.ObjectId,
        ref: 'schedules'
    }
})

terminalgatesSchema.pre('save', function (next) {
    var now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

mongoose.model('terminalgates', terminalgatesSchema);
