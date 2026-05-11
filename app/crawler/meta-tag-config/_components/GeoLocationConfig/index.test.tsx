import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next/dynamic', () => ({
  default: () => {
    const Comp = ({ center, radius, onCenterChange, readOnly }: Record<string, unknown>) =>
      React.createElement('div', { 'data-testid': 'map-picker', 'data-readonly': String(readOnly) }, 'Map');
    Comp.displayName = 'MapPicker';
    return Comp;
  },
}));

import GeoLocationConfig, { DEFAULT_GEO_CONFIG, GeoLocationConfigAlert } from './index';

describe('GeoLocationConfig', () => {
  const mockOnChange = vi.fn();
  const mockOnSave = vi.fn();
  beforeEach(() => { vi.clearAllMocks(); });

  it('renders with default config', () => {
    render(React.createElement(GeoLocationConfig));
    expect(screen.getByText('Geo Location Filter')).toBeTruthy();
    expect(screen.getByText('Disabled')).toBeTruthy();
  });

  it('does not show map when disabled', () => {
    render(React.createElement(GeoLocationConfig));
    expect(screen.queryByTestId('map-picker')).toBeFalsy();
  });

  it('shows map when enabled', () => {
    render(React.createElement(GeoLocationConfig, { initValue: { ...DEFAULT_GEO_CONFIG, enabled: true } }));
    expect(screen.getByTestId('map-picker')).toBeTruthy();
  });

  it('toggles enabled state', async () => {
    const user = userEvent.setup();
    render(React.createElement(GeoLocationConfig, { onChange: mockOnChange }));
    await user.click(screen.getByRole('switch'));
    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ enabled: true }));
  });

  it('renders save button when onSave provided', () => {
    render(React.createElement(GeoLocationConfig, { onSave: mockOnSave }));
    expect(screen.getByText('Save Configuration')).toBeTruthy();
  });

  it('calls onSave when save clicked', async () => {
    const user = userEvent.setup();
    render(React.createElement(GeoLocationConfig, { onSave: mockOnSave }));
    await user.click(screen.getByText('Save Configuration'));
    expect(mockOnSave).toHaveBeenCalled();
  });

  it('renders readOnly without save button', () => {
    render(React.createElement(GeoLocationConfig, { readOnly: true, onSave: mockOnSave }));
    expect(screen.queryByText('Save Configuration')).toBeFalsy();
  });

  it('renders lat/lng inputs when enabled', () => {
    render(React.createElement(GeoLocationConfig, { initValue: { ...DEFAULT_GEO_CONFIG, enabled: true } }));
    expect(screen.getByPlaceholderText('e.g. 10.7769')).toBeTruthy();
    expect(screen.getByPlaceholderText('e.g. 106.7009')).toBeTruthy();
  });

  it('renders meta tag mapping inputs when enabled', () => {
    render(React.createElement(GeoLocationConfig, { initValue: { ...DEFAULT_GEO_CONFIG, enabled: true } }));
    expect(screen.getByPlaceholderText(/geo.position, ICBM, custom-lat/)).toBeTruthy();
    expect(screen.getByPlaceholderText(/geo.position, ICBM, custom-lng/)).toBeTruthy();
  });

  it('updates center lat via input', async () => {
    const user = userEvent.setup();
    render(React.createElement(GeoLocationConfig, { initValue: { ...DEFAULT_GEO_CONFIG, enabled: true }, onChange: mockOnChange }));
    const latInput = screen.getByPlaceholderText('e.g. 10.7769');
    await user.clear(latInput);
    await user.type(latInput, '20');
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('updates center lng via input', async () => {
    const user = userEvent.setup();
    render(React.createElement(GeoLocationConfig, { initValue: { ...DEFAULT_GEO_CONFIG, enabled: true }, onChange: mockOnChange }));
    const lngInput = screen.getByPlaceholderText('e.g. 106.7009');
    await user.clear(lngInput);
    await user.type(lngInput, '50');
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('updates meta tag lat key', async () => {
    const user = userEvent.setup();
    render(React.createElement(GeoLocationConfig, { initValue: { ...DEFAULT_GEO_CONFIG, enabled: true }, onChange: mockOnChange }));
    const latKeyInput = screen.getByPlaceholderText(/geo.position, ICBM, custom-lat/);
    await user.type(latKeyInput, 'geo.lat');
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('updates meta tag lng key', async () => {
    const user = userEvent.setup();
    render(React.createElement(GeoLocationConfig, { initValue: { ...DEFAULT_GEO_CONFIG, enabled: true }, onChange: mockOnChange }));
    const lngKeyInput = screen.getByPlaceholderText(/geo.position, ICBM, custom-lng/);
    await user.type(lngKeyInput, 'geo.lng');
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('syncs value prop changes', () => {
    const { rerender } = render(React.createElement(GeoLocationConfig, { value: { ...DEFAULT_GEO_CONFIG, enabled: true } }));
    expect(screen.getByTestId('map-picker')).toBeTruthy();
    rerender(React.createElement(GeoLocationConfig, { value: { ...DEFAULT_GEO_CONFIG, enabled: false } }));
    expect(screen.queryByTestId('map-picker')).toBeFalsy();
  });
});

describe('GeoLocationConfigAlert', () => {
  it('renders alert', () => {
    const { container } = render(GeoLocationConfigAlert);
    expect(container.firstChild).toBeTruthy();
  });
});

describe('DEFAULT_GEO_CONFIG', () => {
  it('has expected shape', () => {
    expect(DEFAULT_GEO_CONFIG.enabled).toBe(false);
    expect(DEFAULT_GEO_CONFIG.radius.unit).toBe('mi');
    expect(DEFAULT_GEO_CONFIG.center.lat).toBe(10.7769);
  });
});
