const mongoose = require ('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');

let User = mongoose.Schema
(
    {
        username:{
            type: String,
            required: 'username is required'
        },

        displayName:{
            type: String,
            default: '',
            required: 'DisplayName is required'
        }
    },
    {
        collection:'users'
    }
)

let options = ({missingPasswordError: 'wrong/ missing password'});
User.plugin(passportLocalMongoose, options)
module.exports.User = mongoose.model('User', User)