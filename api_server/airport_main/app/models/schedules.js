var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var schedulesSchema = new Schema({
    "airline": {
        "type": "string"
    },
    "departing_to": {
        "type": "string"
    },
    "arriving_from": {
        "type": "string"
    },
    "flight": {
        "type": "number"
    },
    "scheduled": {
        "type": "Date"
    },
    "estimated": {
        "type": "Date"
    },
    "status": {
        "type": "string"
    },
    created_at: { type: Date },
    updated_at: { type: Date },
})

schedulesSchema.pre('save', function (next) {
    var now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

mongoose.model('schedules', schedulesSchema);