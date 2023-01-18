var mongoose = require("mongoose");

var Schema = mongoose.Schema;

/**
 * Problem Defination : Assign Baggage Carousel number to Arriving flights - the system should prevent conflicting assignments.
 * Precondition : Flight have been already assigned the gate 
 * Carousels are only assigned to arriving flights. This information needs to be shown also on the arrival area on tv.
 * We assume there are 8 carousels in each terminal.
 * Terminal 1: T1C1 - T1C8
 * Terminal 2: T2C1 - T2C8
 * Terminal 3: T3C1 - T3C8
 * ExpiresAt : arrival time + 30 min - will be cleared via cronjob
 * flightId : to which filght its assigned
 */

// var baggageClaim = [][]

var carouselsSchema = new Schema({
    "carousel": {
        "type": "string",
        unique: true
    },
    "flightId": {
        "type": Schema.Types.ObjectId,
        ref: 'schedules'
    }
})

carouselsSchema.pre('save', function (next) {
    var now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

mongoose.model('carousels', carouselsSchema);