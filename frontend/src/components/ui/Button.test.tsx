import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders its label and responds to a click (happy path)', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Save</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('is disabled and unclickable while isLoading is true (failure mode: double-submit)', () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} isLoading>
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('respects an explicit disabled prop (boundary case)', () => {
    render(<Button disabled>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });
});
