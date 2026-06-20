const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');


// Normal users (and admins, who may also browse) can access these
router.use(authenticate, authorize('USER', 'ADMIN'));

router.get('/stores', userController.getStores);
router.post('/ratings',  userController.submitRating);
router.put('/ratings/:storeId',   userController.updateRating);

module.exports = router;
