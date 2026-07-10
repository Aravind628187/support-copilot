import { describe, expect, it } from 'vitest';
import { toCsv } from '../../src/utils/csv';

describe('toCsv', () => {
  it('writes a header row followed by one row per record', () => {
    const csv = toCsv([{ id: '1', name: 'Ada' }], ['id', 'name']);
    expect(csv).toBe('id,name\n1,Ada');
  });

  it('quotes and escapes a cell containing a comma (boundary case)', () => {
    const csv = toCsv([{ id: '1', name: 'Lovelace, Ada' }], ['id', 'name']);
    expect(csv).toBe('id,name\n1,"Lovelace, Ada"');
  });

  it('doubles internal quotes inside a quoted cell (boundary case)', () => {
    const csv = toCsv([{ id: '1', note: 'She said "hello"' }], ['id', 'note']);
    expect(csv).toBe('id,note\n1,"She said ""hello"""');
  });

  it('renders null/undefined values as an empty cell rather than the string "null" (failure mode)', () => {
    const csv = toCsv([{ id: '1', assignee: null }], ['id', 'assignee']);
    expect(csv).toBe('id,assignee\n1,');
  });
});
