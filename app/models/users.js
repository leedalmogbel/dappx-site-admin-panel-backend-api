const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    public_address: {
        type: String,
        required:true,
        index: true
    },
    email_id: {
        type: String,
        index: true,
    },
    referral_code: {
        type: String,
        index: true,
    },
    referral_by: {
        type: String,
    },
    balance: {
        type: Number
    },
    is_blocked: {
        type: Number
    }
});

usersSchema.set('timestamps', true);
usersSchema.plugin(uniqueValidator);
usersSchema.set('toJSON', {
    virtuals: true,
});

const Users = mongoose.model('Users', usersSchema);
module.exports = Users;