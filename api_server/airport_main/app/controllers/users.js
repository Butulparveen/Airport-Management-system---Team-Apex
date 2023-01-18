var mongoose = require('mongoose')
var _ = require('underscore')
var isEmpty = require('is-empty')
var users = mongoose.model("users")
var debug = require('debug')('dev')

const userType = {
    AIRPORT_EMP: 1,
    AIRLINE_EMP: 2,
    CUSTOMER: 3,
}

exports.createUser = function (req, res, next) {
    var usersModel = new users();
    if (req.body != null &&
        !isEmpty(req.body.name) &&
        !isEmpty(req.body.emailid) &&
        !isEmpty(req.body.mobile) &&
        !isEmpty(req.body.passwd) &&
        !isEmpty(req.body.userType) &&
        (req.body.userType == userType.AIRLINE_EMP) && !isEmpty(req.body.airline) ||
        (req.body.userType == userType.AIRPORT_EMP) && !isEmpty(req.body.airport) ||
        (req.body.userType == userType.CUSTOMER) && isEmpty(req.body.airport) && isEmpty(req.body.airline)) {
        // Check if userType is airport employee then airport name field should be present,
        // similarly if userType is airline then airline name field should be present.
        users.findOne({ 'mobile': req.body.mobile }, '-created_at -updated_at -__v',
            function (err, _userpresent) {
                if (err) {
                    res.status(500);
                    res.json({ data: "Error occured:" + err })
                } else {
                    if (_userpresent) {
                        res.json({ data: "user already present" });
                    }
                    else if (!_userpresent) {
                        usersModel.name = req.body.name;
                        usersModel.emailid = req.body.emailid;
                        usersModel.mobile = req.body.mobile;
                        usersModel.passwd = req.body.passwd;
                        usersModel.userType = req.body.userType;
                        usersModel.airport = req.body.airport;
                        usersModel.airline = req.body.airline;

                        usersModel.save(function (err, users) {
                            if (err) {
                                res.status(500);
                                res.json({ data: "Error occured:" + err })
                            } else {
                                res.json({ data: users })
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


exports.login = function (req, res, next) {
    debug("I received : ")
    debug(req.body)
    var responseJson = {};
    var mobile = req.body.mobile;
    var passwd = req.body.passwd;
    if (!isEmpty(mobile) && !isEmpty(passwd)) {
        users.findOne({ 'mobile': mobile, 'passwd': passwd }, '-created_at -updated_at -__v',
            function (err, _userpresent) {
                if (err) {
                    res.status(500);
                    res.json({ data: "Error occured:" + err })
                } else {
                    if (_userpresent) {
                        if (_userpresent.mobile == mobile &&
                            _userpresent.passwd == passwd) {
                            res.status(200);
                            responseJson.emailid = _userpresent.emailid
                            responseJson.userType = _userpresent.userType
                            responseJson.mobile = _userpresent.mobile
                            responseJson.name = _userpresent.name
                            if (_userpresent.userType == userType.AIRLINE_EMP) {
                                responseJson.airline = _userpresent.airline
                            }
                            if (_userpresent.userType == userType.AIRPORT_EMP) {
                                responseJson.airport = _userpresent.airport
                            }
                            res.json(responseJson)
                        }
                        else {
                            res.status(403);
                        }
                    }
                    else {
                        res.status(403);
                        res.json({ data: "user not found!" });
                    }
                }
            })
    }
    else {
        res.status(204);
        res.json({ data: "Incomplete data!" })
    }
    // next();
};