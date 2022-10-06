const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for Users
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        default: ''
    },
    meeting: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    lastLoginTime: {
        type: Date,
        default: Date.now()
    },
    lastSendMsgTime: {
        type: Date,
        default: Date.now()
    },
    lastLoginTimeAhead: {
        type: Date,
        default: Date.now() + 1000 * 3600
    },
    lastSendMsgTimeAhead: {
        type: Date,
        default: Date.now() + 1000 * 3600
    },
    lastNotificationSendTime: {
        type: Date,
        default: Date.now()
    }
});

const User = mongoose.model('users', UserSchema);

module.exports = User;
