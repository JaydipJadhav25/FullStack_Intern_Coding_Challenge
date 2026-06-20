const { PrismaClient } = require('@prisma/client');

// Reuse a single PrismaClient instance across the app (avoids exhausting
// DB connections when nodemon hot-reloads in dev).
const prisma = global.__prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

module.exports = prisma;
