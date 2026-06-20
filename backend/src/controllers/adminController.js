const adminService = require('../services/adminService');

async function dashboard(req, res, next) {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}

async function getUsers(req, res, next) {
  try {
    const { search, sortBy, sortOrder, role } = req.query;
    const users = await adminService.listUsers({ search, sortBy, sortOrder, role });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await adminService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const user = await adminService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

async function getStores(req, res, next) {
  try {
    const { search, sortBy, sortOrder } = req.query;
    const stores = await adminService.listStores({ search, sortBy, sortOrder });
    res.json(stores);
  } catch (err) {
    next(err);
  }
}

async function createStore(req, res, next) {
  try {
    const store = await adminService.createStore(req.body);
    res.status(201).json(store);
  } catch (err) {
    next(err);
  }
}

module.exports = { dashboard, getUsers, getUserById, createUser, getStores, createStore };
