const { body, validationResult } = require('express-validator');
const User = require('../models/user');

// TESTING
// const passport = require('passport');
// const LocalStrategy = require('passport-local');
// const bcrypt = require('bcryptjs');
// const session = require('express-session');

exports.user_create_post = [
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
  // Try writing a custom validator to check if email already exists

  (req, res, next) => {
    // check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array())
      res.render('signup', { title: 'Signup Page', user: req.body, errors: errors.array() });
      return;
    } else {
      User.findOne({ email: req.body.email }).exec((err, found_email) => {
        if (err) { return next(err); }
        if (found_email) {
          // if email already exists, send back to signup page
          res.render('signup', { title: 'Signup Page', user: req.body, errors: [{msg: 'Email address already in use'}] })
        } else {
          const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            membershipStatus: false,
            adminStatus: false
          }).save((err) => {
            if (err) { return next(err); }
            res.render('login', { title: 'Now try logging in' })
          })
        }
      })
    }
  }
]

// exports.login_POST = (req, res, next) => {
//   // passport.use(
//   //   new LocalStrategy((email, password, done) => {
//   //     User.findOne({ email: email}, (err, user) => {
//   //       if (err) { return next(err); }
//   //       if (!user) {
//   //         return done(null, false, { message: 'Email address not found' });
//   //       }
//   //       bcrypt.compare(password, user.password, (err, res) => {
//   //         if (res) {
//   //           return done(null, user)
//   //         } else {
//   //           return done(null, false, { message: 'Incorrect Password' });
//   //         }
//   //       })
//   //     })
//   //   })
//   // )
//   // passport.serializeUser(function(user, done) {
//   //   done(null, user.id);
//   // });
//   // passport.deserializeUser(function(id, done) {
//   //   User.findById(id, function(err, user) {
//   //     done(err, user);
//   //   });
//   // });
//   passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/'
//   })
// }

// will probably need to install passport, passport-local and bcryptjs
// check authentication-basics for a practical example
// USE THE DAMN EXPRESS-VALIDATOR YOU FOOL
// check inventory project for practical examples