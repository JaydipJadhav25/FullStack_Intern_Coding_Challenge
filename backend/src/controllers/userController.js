const userService = require('../services/userService');

async function getStores(req, res, next) {
  try {
    const { search } = req.query;
    const stores = await userService.listStoresForUser(req.user.id, { search });
    res.json(stores);
  } catch (err) {
    next(err);
  }
}

async function submitRating(req, res, next) {
  try {
    const rating = await userService.submitRating(req.user.id, req.body);
    res.status(201).json(rating);
  } catch (err) {
    next(err);
  }
}

async function updateRating(req, res, next) {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const updated = await userService.updateRating(req.user.id, storeId, rating);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

module.exports = { getStores, submitRating, updateRating };
