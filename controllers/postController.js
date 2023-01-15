const { body, validationResult } = require('express-validator');
const Post = require('../models/post');

exports.newPost_GET = (req, res, next) => {
  res.render('newPost', { title: 'New Post' })
}

exports.newPost_POST = [
  // sanitize inputs
  body('message').trim().isLength({ min: 1, max: 5}).escape().withMessage('You post must be between 1 and 500 characters long'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(req.body.message)
      res.render('newPost', { title: 'New Post', data: req.body.message, errors: errors.array() });
      return;
    }
    res.redirect('/index');
  }
]