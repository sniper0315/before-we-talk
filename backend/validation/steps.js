const Validator = require('validator');
const isEmpty = require('is-empty');
const stepTypes = require("../config/stepTypes");

function validateStepInput(data) {
    let errors = {};

    // Converts empty fields to String in order to validate them
    data.stepNumber = !isEmpty(data.stepNumber) ? data.stepNumber : 0;
    data.stepType = !isEmpty(data.stepType) ? data.stepType : '';
    data.content = !isEmpty(data.content) ? data.content : '';

    if (data.stepNumber === 0 || !Validator.isNumeric(data.stepNumber.toString())) {
        errors.stepNumber = 'Step number is invalid';
    }

    if (Validator.isEmpty(data.stepType)) {
        errors.stepType = 'Step type is required';
    }

    if (!Validator.isEmpty(data.stepType) && !stepTypes.includes(data.stepType)) {
        errors.stepType = 'Step type is invalid';
    }

    if (Validator.isEmpty(data.content)) {
        errors.content = 'Content is required';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
}

module.exports = { validateStepInput }