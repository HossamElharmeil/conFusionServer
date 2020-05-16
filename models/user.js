var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var user = Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    facebookId: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false,
    }
});

user.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', user);