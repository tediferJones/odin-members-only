var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const User = require('./models/user');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

// database connection
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
console.log(process.env.mongoDB);
db.on('error', console.error.bind(console, 'MongoDB Connection Error: '));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// passport stuff goes here (maybe?)
passport.use(
  new LocalStrategy((email, password, done) => {
    User.findOne({ email: email}, (err, user) => {
      if (err) { return next(err); }
      if (!user) {
        return done(null, false, { message: 'Email address not found' });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user)
        } else {
          return done(null, false, { message: 'Incorrect Password' });
        }
      })
    })
  })
)
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// dont know what this does so we disable it
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.post('/login', passport.authenticate('local', {
//   successRedirect: '/signup',
//   failureRedirect: '/login'
// }));

module.exports = app;
