var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController');
const postController = require('../controllers/postController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Members Only' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login Page' })
})

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Signup Page' })
})

// TEST, probably gunna brick it
router.post('/signup', userController.user_create_post);

// consider adding route for '/status' which will show membership and admin status
// or just add something to the header of the home page that will display membership and admin status as red/green indicators

module.exports = router;

// consider trying to make this look like the inventory project
