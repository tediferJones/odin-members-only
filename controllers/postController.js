const { body, validationResult } = require('express-validator');
const Post = require('../models/post');

function reverseOrder(arr) {
  const reversedArr = [];
  while (arr.length) {
    reversedArr.unshift(arr.shift());
  }
  return reversedArr;
}

exports.home_GET = (req, res, next) => {
  Post.find({}).exec(function (err, allPosts) {
    if (err) { return next(err); }
    res.render('index', { title: 'Members Only', allPosts: reverseOrder(allPosts) });
  });
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
    new Post({
      message: req.body.message,
      author: req.user.email,
      date: new Date().toDateString() + ' at ' + new Date().toLocaleTimeString()
    }).save((err) => {
      if (err) { return next(err); }
      res.redirect('/');
    });
  }
]

exports.post_GET = (req, res, next) => {
  // rename this function and route, doesnt make sense
  // fix url, current URL comes from post ID, should be user ID
  Post.findById(req.params.id, function(err, postData) {
    if (err) { return next(err); }
    Post.find({ author: postData.author }, function(err, allPosts) {
      if (err) { return next(err); }
      res.render('postDetail', { title: 'More posts by this author', allPosts: reverseOrder(allPosts) })
    })
  })
}

exports.postDelete_GET = (req, res, next) => {
  Post.findByIdAndDelete(req.params.id, function(err, deletedPost) {
    if (err) { return next(err); }
    res.redirect('/');
  })
}