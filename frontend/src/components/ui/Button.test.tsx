import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { Button } from './Button';

afterEach(() => {
  cleanup();
});

describe('Button', () => {
  it('renders its label and responds to a click (happy path)', () => {
    const handleClick = vi.fn();

    const { getByRole } = render(
      <Button onClick={handleClick}>
        Save
      </Button>
    );

    fireEvent.click(getByRole('button', { name: 'Save' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled and unclickable while isLoading is true (failure mode: double-submit)', () => {
    const handleClick = vi.fn();

    const { getByRole } = render(
      <Button onClick={handleClick} isLoading>
        Save
      </Button>
    );

    const button = getByRole('button', { name: 'Save' });

    expect(button).toBeDisabled();

    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('respects an explicit disabled prop (boundary case)', () => {
    const { getByRole } = render(
      <Button disabled>
        Save
      </Button>
    );

    expect(getByRole('button', { name: 'Save' })).toBeDisabled();
  });
});