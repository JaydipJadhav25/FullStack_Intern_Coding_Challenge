const prisma = require('../config/prisma');

/**
 * A store owner may own multiple stores in the schema, but the UI assumes
 * one primary store. We aggregate across all owned stores for the dashboard
 * summary, and also return the per-store breakdown.
 */
async function getOwnerDashboard(ownerId) {
  
  const stores = await prisma.store.findMany({
    where: { ownerId },
    select: {
      id: true,
      name: true,
      address: true,
      ratings: {
        select: {
          rating: true,
          createdAt: true,
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (stores.length === 0) {
    return { stores: [], averageRating: null, totalRatings: 0 };
  }

  const storesWithStats = stores.map((s) => {
    const ratingValues = s.ratings.map((r) => r.rating);
    const avg = ratingValues.length
      ? Number((ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(2))
      : null;
    return {
      id: s.id,
      name: s.name,
      address: s.address,
      averageRating: avg,
      totalRatings: ratingValues.length,
      raters: s.ratings.map((r) => ({
        userId: r.user.id,
        name: r.user.name,
        email: r.user.email,
        rating: r.rating,
        ratedAt: r.createdAt,
      })),
    };
  });

  const allRatings = stores.flatMap((s) => s.ratings.map((r) => r.rating));
  const overallAverage = allRatings.length
    ? Number((allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2))
    : null;

  return {
    stores: storesWithStats,
    averageRating: overallAverage,
    totalRatings: allRatings.length,
  };
}

module.exports = { getOwnerDashboard };
