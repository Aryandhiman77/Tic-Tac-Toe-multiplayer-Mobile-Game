const { body } = require('express-validator');

const LoginValidations = [
  body('email', "Please enter a valid email address.")
    .isEmail()
    .trim(),

  body('password', "Password must be 8-20 characters.")
    .isLength({ min: 8, max: 20 })
    .trim(),
];

const RegistrationValidations = [
  body('username', "Username must be 3-20 characters.")
    .isLength({ min: 3, max: 20 }),

  body('email', "Please enter a valid email.")
    .isEmail()
    .trim()
    .toLowerCase(),

  body('password', "Password must be 8-20 characters.")
    .isLength({ min: 8, max: 20 })
    .trim(),
];

module.exports = {
  LoginValidations,
  RegistrationValidations,
};
