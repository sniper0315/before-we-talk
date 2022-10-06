const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const stepTypes = require("../config/stepTypes");

// Create Schema for Users
const MessageSchema = new Schema({
    room: {
        type: Schema.Types.ObjectId,
        ref: 'rooms'
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    content: {
        type: String,
        required: true,
    },
    flowId: {
        type: String,
        required: true,
    },
    stepType: {
        type: String,
        enum: stepTypes,
        default: 'Text'
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    viewed: {
        type: Date
    },
    notified: {
        type: Date
    }
    // + 5 * 365 * 24 * 60 * 60 * 1000
});

module.exports = Message = mongoose.model('messages', MessageSchema);
