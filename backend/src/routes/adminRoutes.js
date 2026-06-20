const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

// Every route here requires a logged-in ADMIN
router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', adminController.dashboard);

router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users',  adminController.createUser);

router.get('/stores', adminController.getStores);
router.post('/stores',  adminController.createStore);

module.exports = router;
