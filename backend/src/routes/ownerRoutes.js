const express = require('express');
const router = express.Router();

const ownerController = require('../controllers/ownerController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

router.use(authenticate, authorize('STORE_OWNER'));

router.get('/dashboard', ownerController.dashboard);
router.get('/ratings', ownerController.ratings);

module.exports = router;
