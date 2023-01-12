const { body, validationResult } = require('express-validator');
const User = require('../models/user');

exports.user_create_post = (req, res, next) => {

}

// will probably need to install passport, passport-local and bcryptjs
// check authentication-basics for a practical example
// USE THE DAMN EXPRESS-VALIDATOR YOU FOOL
// check inventory project for practical examples