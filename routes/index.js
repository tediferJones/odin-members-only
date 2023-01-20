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

router.get('/user', userController.userDetails_GET)

router.get('/membership', userController.membership_GET);
router.post('/membership', userController.membership_POST);
router.get('/membership/revoke', userController.membershipRevoke_GET);

router.get('/admin', userController.admin_GET);
router.post('/admin', userController.admin_POST);
router.get('/admin/revoke', userController.adminRevoke_GET);

router.get('/newpost', postController.newPost_GET);
router.post('/newpost', postController.newPost_POST);

router.get('/post/:id', postController.postDetail_GET);
router.get('/post/:id/delete', postController.postDelete_GET);

router.get('/user/:id', postController.authorDetail_GET);

module.exports = router;
