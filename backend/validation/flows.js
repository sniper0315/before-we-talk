const Validator = require('validator');
const isEmpty = require('is-empty');

function validateFlowInput(data) {
    let errors = {};

    // Converts empty fields to String in order to validate them
    data.name = !isEmpty(data.name) ? data.name : '';

    if (Validator.isEmpty(data.name)) {
        errors.name = 'Flow name is required';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
}

module.exports = { validateFlowInput }