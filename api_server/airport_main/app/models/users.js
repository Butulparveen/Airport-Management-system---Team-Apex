var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var usersSchema = new Schema({
    "name": { "type": "string" },
    "mobile": { "type": "string", "unique": true },
    "emailid": { "type": "string", "unique": true },
    "passwd": { "type": "string" },
    "userType": {
        "type": "string",
        "enum": ['1', '2', '3'],
    },
    "airport": "string",
    "airline": "string",
    created_at: { type: Date },
    updated_at: { type: Date }
})

usersSchema.pre('save', function (next) {
    var now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

mongoose.model('users', usersSchema);