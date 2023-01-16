const { body, validationResult } = require('express-validator');
const Post = require('../models/post');

exports.home_GET = (req, res, next) => {
  Post.find({}).exec(function (err, allPosts) {
    if (err) { return next(err); }
    console.log(allPosts)
    res.render('index', { title: 'Members Only', allPosts });
  });
  // console.log(allPosts)
  // res.render('index', { title: 'Members Only' });
}

exports.newPost_GET = (req, res, next) => {
  res.render('newPost', { title: 'New Post' });
}

exports.newPost_POST = [
  // sanitize inputs
  body('message').trim().isLength({ min: 1, max: 500}).escape().withMessage('You post must be between 1 and 500 characters long'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('newPost', { title: 'New Post', data: req.body.message, errors: errors.array() });
      return;
    }
    console.log(req.user);
    new Post({
      // req.user for user data
      message: req.body.message,
      author: req.user.email,
      date: new Date()
    }).save((err) => {
      if (err) { return next(err); }
      res.redirect('/');
    });
  }
]