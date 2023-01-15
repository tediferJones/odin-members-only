const { body, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.signup_GET = (req, res, next) => {
  res.render('signup', { title: 'Signup Page' })
}

exports.signup_POST = [
  // Sanitize Inputs
  body('firstName').trim().isLength({ min: 1, max: 32 }).escape().withMessage('First Name must be between 1 and 32 characters long'),
  body('lastName').trim().isLength({ min: 1, max: 32 }).escape().withMessage('Last Name must be between 1 and 32 characters long'),
  body('email').trim().isLength({ min: 1 }).isEmail().escape().withMessage('Email address is invalid'),
  body('password').isLength({ min: 8}).withMessage('Password must be at least 8 characters long'),
  body('passwordConfirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),

  (req, res, next) => {
    // check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) { // cant this just be 'if(errors)'?
      // console.log(errors.array())
      res.render('signup', { title: 'Signup Page', user: req.body, errors: errors.array() });
      return;
    } else {
      User.findOne({ email: req.body.email }).exec((err, found_email) => {
        if (err) { return next(err); }
        if (found_email) {
          // if email already exists, send back to signup page
          res.render('signup', { title: 'Signup Page', user: req.body, errors: [{msg: 'Email address already in use'}] })
        } else {
          // if email doesnt already exist, make a new user with their hashedPassword
          bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if (err) { return next(err); }
            new User({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              password: hashedPassword,
              membershipStatus: false,
              adminStatus: false
            }).save((err) => {
              if (err) { return next(err); }
              res.redirect('/login')
            })
          })
        }
      })
    }
  }
]

exports.login_GET = (req, res, next) => {
  res.render('login', { title: 'Login Page' });
}

exports.login_POST = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })(req, res, next)
}

exports.logout_GET = (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
};
