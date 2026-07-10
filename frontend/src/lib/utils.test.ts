import { describe, expect, it } from 'vitest';
import { formatHours, initials } from '../lib/utils';

describe('formatHours', () => {
  it('formats sub-hour durations in minutes (happy path)', () => {
    expect(formatHours(0.5)).toBe('30m');
  });

  it('formats same-day durations in hours with one decimal', () => {
    expect(formatHours(4.25)).toBe('4.3h');
  });

  it('formats multi-day durations in days (boundary case)', () => {
    expect(formatHours(48)).toBe('2.0d');
  });

  it('handles zero without throwing (failure mode)', () => {
    expect(formatHours(0)).toBe('0m');
  });
});

describe('initials', () => {
  it('takes the first letter of the first two words (happy path)', () => {
    expect(initials('Admin')).toBe('A');
  });

  it('handles a single-word name (boundary case)', () => {
    expect(initials('Cher')).toBe('C');
  });

  it('handles extra whitespace without producing blank initials (failure mode)', () => {
    expect(initials('  Sam   Agent  ')).toBe('SA');
  });
});
