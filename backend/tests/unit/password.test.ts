import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from '../../src/utils/password';

describe('password hashing', () => {
  it('hashes a password to a bcrypt string, never the plaintext', async () => {
    const hash = await hashPassword('Sup3rSecret!');
    expect(hash).not.toBe('Sup3rSecret!');
    expect(hash).toMatch(/^\$2[aby]\$/);
  });

  it('verifies the correct password against its hash', async () => {
    const hash = await hashPassword('Sup3rSecret!');
    await expect(verifyPassword('Sup3rSecret!', hash)).resolves.toBe(true);
  });

  it('rejects an incorrect password (the most likely failure mode)', async () => {
    const hash = await hashPassword('Sup3rSecret!');
    await expect(verifyPassword('WrongPassword!', hash)).resolves.toBe(false);
  });

  it('produces a different hash for the same password on each call (unique salt)', async () => {
    const hashA = await hashPassword('Sup3rSecret!');
    const hashB = await hashPassword('Sup3rSecret!');
    expect(hashA).not.toBe(hashB);
  });
});
