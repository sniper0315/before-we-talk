const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for Steps
const TempStepSchema = new Schema({
  email: {
      type: String,
      required: true,
      unique: true
  },
  stepList: [{
    stepType: String,
    content: String,
    description: String
  }],
  flowName: {
    type: String
  }
});

const TempStep = mongoose.model('tempsteps', TempStepSchema);

module.exports = TempStep;
