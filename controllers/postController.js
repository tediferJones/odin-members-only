const { body, validationResult } = require('express-validator');
const Post = require('../models/post');
// const he = require('he');

exports.home_GET = (req, res, next) => {
  Post.find({}).exec(function (err, allPosts) {
    if (err) { return next(err); }
    // write a unescape function to restore original values to text posts
    // function unescape(str) {
    //   const e = document.createElement('div');
    //   e.innerHTML = str;
    //   return e.innerText;
    // }
    for (let post of allPosts) {
      // console.log(he.decode(post.message))
      // post.message = he.decode(post.message);
    }
    res.render('index', { title: 'Members Only', allPosts });
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

exports.post_GET = (req, res, next) => {
  // get this post (use req.params._id to fetch id) and display

  // find the post with the given ID, then get the email of the user that posted it
  // get all posts with matching author and display
  Post.findById(req.params.id, function(err, postData) {
    if (err) { return next(err); }
    // console.log(postData.author)
    Post.find({ author: postData.author }, function(err, allPosts) {
      if (err) { return next(err); }
      // console.log(allPosts)
      res.render('postDetail', { title: 'More posts by this author', allPosts })
    })
  })
  // res.render('postDetail', { title: 'Other posts by this author' })
}

exports.postDelete_GET = (req, res, next) => {
  Post.findByIdAndDelete(req.params.id, function(err, deletedPost) {
    if (err) { return next(err); }
    res.redirect('/');
  })
}