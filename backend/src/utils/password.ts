import bcrypt from 'bcryptjs';

// bcryptjs (pure JS) trades a little speed for zero native build dependencies,
// which matters for a portfolio project reviewers will `npm install` on
// whatever machine they have. Cost factor 12 matches the handbook's floor.
const SALT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
