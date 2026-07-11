import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('deployment configuration', () => {
  it('uses the compiled backend entrypoint for startup', () => {
    const pkgPath = path.resolve(__dirname, '../../package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as { scripts?: { start?: string } };

    expect(pkg.scripts?.start).toContain('dist/src/index.js');
  });
});
