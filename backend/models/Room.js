const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for Flows
const RoomSchema = new Schema({
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    room_name: {
        type: String,
        required: true,
    },
    flow_id: {
        type: String,
        required: true
    },
    invited_user: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        default: null
    }
});

const Room = mongoose.model('rooms', RoomSchema);

module.exports = Room;
