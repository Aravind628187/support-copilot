import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseEnv } from '../../src/config/env';

describe('deployment configuration', () => {
  it('uses the compiled backend entrypoint for startup', () => {
    const pkgPath = path.resolve(__dirname, '../../package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as { scripts?: { start?: string } };

    expect(pkg.scripts?.start).toContain('dist/src/index.js');
  });

  it('generates JWT secrets when they are missing', () => {
    const parsed = parseEnv({
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
      NODE_ENV: 'production',
    });

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.JWT_ACCESS_SECRET.length).toBeGreaterThan(16);
      expect(parsed.data.JWT_REFRESH_SECRET.length).toBeGreaterThan(16);
    }
  });
});
