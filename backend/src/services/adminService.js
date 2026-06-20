const prisma = require('../config/prisma');
const { hashPassword } = require('../utils/auth');

async function getDashboardStats() {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);
  return { totalUsers, totalStores, totalRatings };
}

const SORTABLE_USER_FIELDS = ['name', 'email', 'address', 'role'];
const SORTABLE_STORE_FIELDS = ['name', 'email', 'address', 'rating'];

/**
 * List users with optional search (name/email/address/role) and sorting.
 * Search is case-insensitive substring match across the text fields;
 * role search matches exactly (since it's an enum).
 */
async function listUsers({ search, sortBy, sortOrder, role }) {
  const order = sortOrder === 'desc' ? 'desc' : 'asc';
  const field = SORTABLE_USER_FIELDS.includes(sortBy) ? sortBy : 'name';

  const where = {};
  const and = [];

  if (role) {
    and.push({ role });
  }

  if (search) {
    and.push({
      OR: [
        { name: { contains: search } },
        { email: { contains: search } },
        { address: { contains: search } },
      ],
    });
  }

  if (and.length) where.AND = and;

  const users = await prisma.user.findMany({
    where,
    orderBy: { [field]: order },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
      // Include owned store rating summary when relevant (store owners)
      stores: {
        select: {
          id: true,
          name: true,
          ratings: { select: { rating: true } },
        },
      },
    },
  });

  // Attach computed average rating for STORE_OWNER rows, mirroring the
  // "Store Owner" detail view requirement.
  return users.map((u) => {
    let storeRating = null;
    if (u.role === 'STORE_OWNER' && u.stores.length > 0) {
      const allRatings = u.stores.flatMap((s) => s.ratings.map((r) => r.rating));
      storeRating = allRatings.length
        ? Number((allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2))
        : null;
    }
    const { stores, ...rest } = u;
    return { ...rest, storeRating };
  });
}

async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
      stores: {
        select: {
          id: true,
          name: true,
          ratings: { select: { rating: true } },
        },
      },
    },
  });

  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  let storeRating = null;
  if (user.role === 'STORE_OWNER' && user.stores.length > 0) {
    const allRatings = user.stores.flatMap((s) => s.ratings.map((r) => r.rating));
    storeRating = allRatings.length
      ? Number((allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2))
      : null;
  }
  const { stores, ...rest } = user;
  return { ...rest, storeRating };
}

async function createUser({ name, email, password, address, role }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('An account with this email already exists');
    err.statusCode = 409;
    throw err;
  }

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, address, role: role || 'USER' },
    select: { id: true, name: true, email: true, address: true, role: true, createdAt: true },
  });
  return user;
}

/**
 * List stores with optional search (name/email/address) and sorting,
 * including the computed average rating.
 */
async function listStores({ search, sortBy, sortOrder }) {
  const order = sortOrder === 'desc' ? 'desc' : 'asc';
  const field = SORTABLE_STORE_FIELDS.includes(sortBy) ? sortBy : 'name';

  const where = search
    ? {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { address: { contains: search } },
        ],
      }
    : {};

  const stores = await prisma.store.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      createdAt: true,
      owner: { select: { id: true, name: true, email: true } },
      ratings: { select: { rating: true } },
    },
  });

  let mapped = stores.map((s) => {
    const ratings = s.ratings.map((r) => r.rating);
    const avgRating = ratings.length
      ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2))
      : null;
    const { ratings: _omit, ...rest } = s;
    return { ...rest, avgRating, totalRatings: ratings.length };
  });

  // 'rating' sort happens in-memory since it's a computed/aggregated field
  if (field === 'rating') {
    mapped.sort((a, b) => {
      const av = a.avgRating ?? -1;
      const bv = b.avgRating ?? -1;
      return order === 'asc' ? av - bv : bv - av;
    });
  } else {
    mapped.sort((a, b) => {
      const av = String(a[field] ?? '').toLowerCase();
      const bv = String(b[field] ?? '').toLowerCase();
      if (av < bv) return order === 'asc' ? -1 : 1;
      if (av > bv) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return mapped;
}

async function createStore({ name, email, address, ownerId }) {
  if (ownerId) {
    const owner = await prisma.user.findUnique({ where: { id: Number(ownerId) } });
    if (!owner) {
      const err = new Error('Specified owner does not exist');
      err.statusCode = 404;
      throw err;
    }
    if (owner.role !== 'STORE_OWNER') {
      const err = new Error('Owner must have the STORE_OWNER role');
      err.statusCode = 422;
      throw err;
    }
  }

  const store = await prisma.store.create({
    data: { name, email, address, ownerId: ownerId ? Number(ownerId) : null },
  });
  return store;
}

module.exports = {
  getDashboardStats,
  listUsers,
  getUserById,
  createUser,
  listStores,
  createStore,
};
