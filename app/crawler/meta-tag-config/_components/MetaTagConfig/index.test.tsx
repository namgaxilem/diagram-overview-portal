import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MetaTagConfig from './index';

const mockTags = [
  { id: '1', attributeKey: 'name', attributeKeyValueToScrape: 'description', attributeValueToScrape: 'content' },
  { id: '2', attributeKey: 'property', attributeKeyValueToScrape: 'og:title', attributeValueToScrape: 'content' },
];

describe('MetaTagConfig', () => {
  const mockOnChange = vi.fn();
  const mockOnSave = vi.fn();
  beforeEach(() => { vi.clearAllMocks(); });

  it('renders with tags', () => {
    render(React.createElement(MetaTagConfig, { initValue: mockTags }));
    expect(screen.getByText('Configured Meta Tags (2)')).toBeTruthy();
    expect(screen.getByText('description')).toBeTruthy();
    expect(screen.getByText('og:title')).toBeTruthy();
  });

  it('renders empty state', () => {
    render(React.createElement(MetaTagConfig, { initValue: [] }));
    expect(screen.getByText(/No meta tags configured/)).toBeTruthy();
  });

  it('renders readOnly without buttons', () => {
    render(React.createElement(MetaTagConfig, { initValue: mockTags, readOnly: true }));
    expect(screen.queryByText('Add Meta Tag')).toBeFalsy();
    expect(screen.queryByText('Save Configuration')).toBeFalsy();
  });

  it('shows add form on click', async () => {
    const user = userEvent.setup();
    render(React.createElement(MetaTagConfig, { initValue: [] }));
    await user.click(screen.getByText('Add Meta Tag'));
    expect(screen.getByText('Add New Meta Tag')).toBeTruthy();
  });

  it('renders form fields with defaults', async () => {
    const user = userEvent.setup();
    render(React.createElement(MetaTagConfig, { initValue: [] }));
    await user.click(screen.getByText('Add Meta Tag'));
    expect(screen.getByDisplayValue('name')).toBeTruthy();
    expect(screen.getByDisplayValue('content')).toBeTruthy();
    expect(screen.getByPlaceholderText('e.g., description, og:title')).toBeTruthy();
  });

  it('cancels add form', async () => {
    const user = userEvent.setup();
    render(React.createElement(MetaTagConfig, { initValue: [] }));
    await user.click(screen.getByText('Add Meta Tag'));
    await user.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Add New Meta Tag')).toBeFalsy();
  });

  it('deletes tag after confirm', async () => {
    const user = userEvent.setup();
    render(React.createElement(MetaTagConfig, { initValue: mockTags, onChange: mockOnChange }));
    const delBtns = screen.getAllByLabelText('delete');
    await user.click(delBtns[0]);
    await waitFor(() => { expect(screen.getByText(/Delete this meta tag/)).toBeTruthy(); });
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(mockOnChange).toHaveBeenCalledWith([mockTags[1]]);
  });

  it('saves configuration', async () => {
    const user = userEvent.setup();
    render(React.createElement(MetaTagConfig, { initValue: mockTags, onSave: mockOnSave }));
    await user.click(screen.getByText('Save Configuration'));
    expect(mockOnSave).toHaveBeenCalledWith(mockTags);
  });

  it('uses value prop', () => {
    const { rerender } = render(React.createElement(MetaTagConfig, { value: mockTags }));
    expect(screen.getByText('description')).toBeTruthy();
    rerender(React.createElement(MetaTagConfig, { value: [mockTags[0]] }));
    expect(screen.getByText('description')).toBeTruthy();
    expect(screen.queryByText('og:title')).toBeFalsy();
  });

  it('opens edit form when edit clicked', async () => {
    const user = userEvent.setup();
    render(React.createElement(MetaTagConfig, { initValue: mockTags }));
    const editBtns = screen.getAllByLabelText('edit');
    await user.click(editBtns[0]);
    expect(screen.getByText('Edit Meta Tag')).toBeTruthy();
  });

  it('shows duplicate error for existing combo', async () => {
    const user = userEvent.setup();
    render(React.createElement(MetaTagConfig, { initValue: mockTags }));
    await user.click(screen.getByText('Add Meta Tag'));
    const matchInput = screen.getByPlaceholderText('e.g., description, og:title');
    await user.clear(matchInput);
    await user.type(matchInput, 'description');
    const form = document.querySelector('form');
    const submitBtn = form?.querySelector('button[type="submit"]') as HTMLButtonElement;
    fireEvent.click(submitBtn!);
    await waitFor(() => {
      expect(screen.getByText(/already exists/)).toBeTruthy();
    });
  });
});
