const ownerService = require('../services/ownerService');

async function dashboard(req, res, next) {
  try {
    const data = await ownerService.getOwnerDashboard(req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function ratings(req, res, next) {
  try {
    const data = await ownerService.getOwnerDashboard(req.user.id);
    const allRaters = data.stores.flatMap((s) =>
      s.raters.map((r) => ({ ...r, storeId: s.id, storeName: s.name }))
    );
    res.json(allRaters);
  } catch (err) {
    next(err);
  }
}

module.exports = { dashboard, ratings };
