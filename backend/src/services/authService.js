const prisma = require('../config/prisma');
const { hashPassword, comparePassword, signToken } = require('../utils/auth');

async function signup({ name, email, password, address }) {
  
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('An account with this email already exists');
    err.statusCode = 409;
    throw err;
  }

  const hashed = await hashPassword(password);

  // Public signup always creates a normal USER. Admins/store owners are
  // provisioned via the admin "create user" endpoint.
  const user = await prisma.user.create({
    data: { name, email, password: hashed, address, role: 'USER' },
    select: { id: true, name: true, email: true, address: true, role: true, createdAt: true },
  });

  const token = signToken({ id: user.id, role: user.role });
  return { user, token };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const token = signToken({ id: user.id, role: user.role });
  const { password: _omit, ...safeUser } = user;
  return { user: safeUser, token };
}

async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const valid = await comparePassword(currentPassword, user.password);
  if (!valid) {
    const err = new Error('Current password is incorrect');
    err.statusCode = 400;
    throw err;
  }

  const hashed = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
  return { message: 'Password updated successfully' };
}

module.exports = { signup, login, changePassword };
