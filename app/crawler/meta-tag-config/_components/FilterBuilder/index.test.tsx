import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterBuilder, { FilterConfigPreview } from './index';

describe('FilterBuilder', () => {
  const mockOnChange = vi.fn();
  beforeEach(() => { vi.clearAllMocks(); });

  it('renders input with placeholder', () => {
    render(React.createElement(FilterBuilder));
    expect(screen.getByPlaceholderText(/latitude/)).toBeTruthy();
  });

  it('calls onChange with config when text entered', () => {
    render(React.createElement(FilterBuilder, { onChange: mockOnChange }));
    fireEvent.change(screen.getByPlaceholderText(/latitude/), { target: { value: 'test' } });
    expect(mockOnChange).toHaveBeenCalledWith({ regex: 'test' });
  });

  it('calls onChange with undefined when cleared', async () => {
    const user = userEvent.setup();
    render(React.createElement(FilterBuilder, { value: { regex: 'old' }, onChange: mockOnChange }));
    await user.clear(screen.getByDisplayValue('old'));
    expect(mockOnChange).toHaveBeenCalledWith(undefined);
  });

  it('renders readOnly with tag', () => {
    render(React.createElement(FilterBuilder, { value: { regex: 'rx' }, readOnly: true }));
    expect(screen.getByText('rx')).toBeTruthy();
  });

  it('renders readOnly no filter', () => {
    render(React.createElement(FilterBuilder, { readOnly: true }));
    expect(screen.getByText('No filter')).toBeTruthy();
  });
});

describe('FilterConfigPreview', () => {
  it('renders no filter', () => {
    render(React.createElement(FilterConfigPreview));
    expect(screen.getByText('No filter')).toBeTruthy();
  });

  it('renders regex', () => {
    render(React.createElement(FilterConfigPreview, { config: { regex: 'abc' } }));
    expect(screen.getByText('abc')).toBeTruthy();
  });
});
