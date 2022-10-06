const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const stepTypes = require("../config/stepTypes");

// Create Schema for Steps
const StepSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    flow: {
        type: mongoose.Types.ObjectId,
        ref: 'flows'
    },
    stepNumber: {
        type: Number,
        default: 1
    },
    stepType: {
        type: String,
        enum: stepTypes,
        default: 'Text'
    },
    content: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: '',
    },
    type: {
        type: String
    }
});

const Step = mongoose.model('steps', StepSchema);

module.exports = Step;
