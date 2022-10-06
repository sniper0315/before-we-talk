const Validator = require('validator');
const EmailValidator = require("node-email-validation");
const isEmpty = require('is-empty');
function validateEmailInput(data) {
    let errors = {};

    // Converts empty fields to String in order to validate them
    data.email = !isEmpty(data.email) ? data.email : '';

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    if (!Validator.isEmpty(data.email) && !EmailValidator.is_email_valid(data.email)) {
        errors.email = 'Email address is not valid';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
}

module.exports = { validateEmailInput }