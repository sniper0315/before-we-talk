const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for Flows
const FlowSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        default: ''
    },
    views: {
        type: Number,
        default: 0
    }
});

const Flow = mongoose.model('flows', FlowSchema);

module.exports = Flow;
