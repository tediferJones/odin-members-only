var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController');
const postController = require('../controllers/postController');

/* GET home page. */
router.get('/', postController.home_GET)

router.get('/login', userController.login_GET);
router.post('/login', userController.login_POST);

router.get('/signup', userController.signup_GET);
router.post('/signup', userController.signup_POST);

router.get('/logout', userController.logout_GET);

router.get('/membership', userController.membership_GET);
router.post('/membership', userController.membership_POST);

router.get('/admin', userController.admin_GET);

router.get('/newpost', postController.newPost_GET);
router.post('/newpost', postController.newPost_POST);

// consider adding route for '/status' which will show membership and admin status
// or just add something to the header of the home page that will display membership and admin status as red/green indicators

module.exports = router;
