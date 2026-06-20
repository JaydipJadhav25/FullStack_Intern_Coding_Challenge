const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function hash(pw) {
  return bcrypt.hash(pw, 10);
}

async function main() {
  console.log('Seeding database...');

  const adminPassword = await hash('Admin@123');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'System Administrator Account User',
      email: 'admin@example.com',
      password: adminPassword,
      address: 'Pune, Maharashtra, India',
      role: 'ADMIN',
    },
  });

  const ownerPassword = await hash('Owner@123');

  const owner1 = await prisma.user.upsert({
    where: { email: 'spice@gmail.com' },
    update: {},
    create: {
      name: 'Spice Garden Restaurant Owner Account',
      email: 'spice@gmail.com',
      password: ownerPassword,
      address: 'Pune, Maharashtra',
      role: 'STORE_OWNER',
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: 'aroma@gmail.com' },
    update: {},
    create: {
      name: 'Cafe Aroma Restaurant Owner Account User',
      email: 'aroma@gmail.com',
      password: ownerPassword,
      address: 'Mumbai, Maharashtra',
      role: 'STORE_OWNER',
    },
  });

  const userPassword = await hash('User@123');
  
  const normalUser1 = await prisma.user.upsert({
    where: { email: 'jaydip@example.com' },
    update: {},
    create: {
      name: 'Jaydip Patel Regular Customer Account',
      email: 'jaydip@example.com',
      password: userPassword,
      address: 'Satara, Maharashtra',
      role: 'USER',
    },
  });

  const normalUser2 = await prisma.user.upsert({
    where: { email: 'rahul@example.com' },
    update: {},
    create: {
      name: 'Rahul Sharma Regular Customer Account',
      email: 'rahul@example.com',
      password: userPassword,
      address: 'Mumbai, Maharashtra',
      role: 'USER',
    },
  });

  const store1 = await prisma.store.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Spice Garden',
      email: 'spice@gmail.com',
      address: 'Pune',
      ownerId: owner1.id,
    },
  });

  const store2 = await prisma.store.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Cafe Aroma',
      email: 'aroma@gmail.com',
      address: 'Mumbai',
      ownerId: owner2.id,
    },
  });

  const store3 = await prisma.store.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Pizza Hub',
      email: 'pizza@gmail.com',
      address: 'Satara',
      ownerId: null,
    },
  });

  await prisma.rating.upsert({
    where: { userId_storeId: { userId: normalUser1.id, storeId: store1.id } },
    update: {},
    create: { userId: normalUser1.id, storeId: store1.id, rating: 5 },
  });

  await prisma.rating.upsert({
    where: { userId_storeId: { userId: normalUser2.id, storeId: store1.id } },
    update: {},
    create: { userId: normalUser2.id, storeId: store1.id, rating: 4 },
  });

  await prisma.rating.upsert({
    where: { userId_storeId: { userId: normalUser1.id, storeId: store2.id } },
    update: {},
    create: { userId: normalUser1.id, storeId: store2.id, rating: 4 },
  });

  console.log('Seed complete.');
  console.log('---');
  console.log('Admin login:      admin@example.com / Admin@123');
  console.log('Store owner login: spice@gmail.com / Owner@123');
  console.log('User login:        jaydip@example.com / User@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
