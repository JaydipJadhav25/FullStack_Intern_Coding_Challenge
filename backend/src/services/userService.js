const prisma = require('../config/prisma');

/**
 * List all stores for the normal-user view: name, address, overall average
 * rating, and the requesting user's own rating (if any) for each store.
 */
async function listStoresForUser(userId, { search }) {
  const where = search
    ? {
        OR: [
          { name: { contains: search } },
          { address: { contains: search } },
        ],
      }
    : {};

  const stores = await prisma.store.findMany({
    where,
    select: {
      id: true,
      name: true,
      address: true,
      ratings: { select: { userId: true, rating: true } },
    },
    orderBy: { name: 'asc' },
  });

  return stores.map((s) => {
    const allRatings = s.ratings.map((r) => r.rating);
    const overallRating = allRatings.length
      ? Number((allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2))
      : null;
    const myRatingEntry = s.ratings.find((r) => r.userId === userId);
    return {
      id: s.id,
      name: s.name,
      address: s.address,
      overallRating,
      totalRatings: allRatings.length,
      myRating: myRatingEntry ? myRatingEntry.rating : null,
    };
  });
}

/**
 * Submit a new rating. Fails if the user has already rated this store
 * (use updateRating instead) thanks to the unique(userId, storeId) constraint.
 */
async function submitRating(userId, { storeId, rating }) {
  const store = await prisma.store.findUnique({ where: { id: Number(storeId) } });
  if (!store) {
    const err = new Error('Store not found');
    err.statusCode = 404;
    throw err;
  }

  try {
    const created = await prisma.rating.create({
      data: { userId, storeId: Number(storeId), rating },
    });
    return created;
  } catch (err) {
    if (err.code === 'P2002') {
      const dup = new Error('You have already rated this store. Use update instead.');
      dup.statusCode = 409;
      throw dup;
    }
    throw err;
  }
}

async function updateRating(userId, storeId, rating) {
  const existing = await prisma.rating.findUnique({
    where: { userId_storeId: { userId, storeId: Number(storeId) } },
  });

  if (!existing) {
    const err = new Error('You have not rated this store yet');
    err.statusCode = 404;
    throw err;
  }

  const updated = await prisma.rating.update({
    where: { userId_storeId: { userId, storeId: Number(storeId) } },
    data: { rating },
  });
  return updated;
}

module.exports = { listStoresForUser, submitRating, updateRating };
