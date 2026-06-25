import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GeoRadiusEditor from './GeoRadiusEditor';
import type { MapPickerProps } from './MapPicker';

// Stub the lazy MapPicker with a button that emits a center change, so we can
// exercise GeoRadiusEditor's handleCenterChange without loading leaflet.
vi.mock('./MapPicker', () => ({
  default: ({ center, onCenterChange, readOnly }: MapPickerProps) => (
    <button
      data-testid="map-picker"
      data-center={JSON.stringify(center)}
      data-readonly={String(readOnly)}
      onClick={() => onCenterChange?.(12.3456789, -98.7654321)}
    >
      Map
    </button>
  ),
}));

describe('GeoRadiusEditor', () => {
  it('renders lat/lng/radius inputs', async () => {
    render(<GeoRadiusEditor />);
    expect(await screen.findByTestId('map-picker')).toBeTruthy();
    expect(screen.getByPlaceholderText('e.g. 31.75726')).toBeTruthy();
    expect(screen.getByPlaceholderText('e.g. -106.345542')).toBeTruthy();
    expect(screen.getByPlaceholderText('radius (mi)')).toBeTruthy();
  });

  it('defaults the map center to the US center when no value set', async () => {
    render(<GeoRadiusEditor />);
    const picker = await screen.findByTestId('map-picker');
    expect(JSON.parse(picker.dataset.center!)).toEqual({ lat: 39.8283, lng: -98.5795 });
  });

  it('uses the provided lat/lng as the map center', async () => {
    render(<GeoRadiusEditor value={{ field: 'location', lat: 10, lng: 20, radiusMi: 5 }} />);
    const picker = await screen.findByTestId('map-picker');
    expect(JSON.parse(picker.dataset.center!)).toEqual({ lat: 10, lng: 20 });
  });

  it('emits rounded lat/lng on map center change', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <GeoRadiusEditor
        value={{ field: 'location', lat: null, lng: null, radiusMi: 5 }}
        onChange={onChange}
      />
    );
    await user.click(await screen.findByTestId('map-picker'));
    expect(onChange).toHaveBeenCalledWith({
      field: 'location',
      lat: 12.345679,
      lng: -98.765432,
      radiusMi: 5,
    });
  });

  it('emits radius changes from the radius input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<GeoRadiusEditor onChange={onChange} />);
    await user.type(screen.getByPlaceholderText('radius (mi)'), '7');
    expect(onChange).toHaveBeenLastCalledWith({
      field: 'location',
      lat: null,
      lng: null,
      radiusMi: 7,
    });
  });

  it('emits field changes from the field input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<GeoRadiusEditor onChange={onChange} />);
    await user.type(screen.getByPlaceholderText('location'), 'x');
    expect(onChange).toHaveBeenLastCalledWith({
      field: 'locationx',
      lat: null,
      lng: null,
      radiusMi: null,
    });
  });

  it('passes readOnly down to the map when disabled', async () => {
    render(<GeoRadiusEditor disabled />);
    const picker = await screen.findByTestId('map-picker');
    expect(picker.dataset.readonly).toBe('true');
  });
});
