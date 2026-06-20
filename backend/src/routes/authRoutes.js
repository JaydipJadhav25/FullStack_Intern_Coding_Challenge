const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');



router.post('/signup',  authController.signup);

router.post('/login',  authController.login);
router.post(
  '/change-password',
  authenticate,
  authController.changePassword
);

module.exports = router;
