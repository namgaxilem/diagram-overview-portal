import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Stub the lazy-loaded MapPicker so leaflet is never loaded in tests.
vi.mock('./MapPicker', () => ({
  default: () => <div data-testid="map-picker">Map</div>,
}));

import MongoFilterBuilder from './index';
import {
  serializeLocation,
  deserializeLocation,
  DEFAULT_FIELD,
  DEFAULT_GEO,
  LOCATION_FILTER_KEY,
} from './serialization';
import type { MongoFilter } from './types';

const COMPLETE_GEO = { field: 'location', lat: 31.75726, lng: -106.345542, radiusMi: 10 };
const MONGO_LOCATION: MongoFilter = {
  location_filter: { field: 'location', lat: 31.75726, lng: -106.345542, distance: 10 },
};

describe('MongoFilterBuilder serialization', () => {
  it('uses "location" as the default field name', () => {
    expect(DEFAULT_FIELD).toBe('location');
  });

  it('uses "location_filter" as the top-level key', () => {
    expect(LOCATION_FILTER_KEY).toBe('location_filter');
  });

  it('serializes a complete geo value into a location_filter object', () => {
    expect(serializeLocation(COMPLETE_GEO)).toEqual(MONGO_LOCATION);
  });

  it('falls back to the default field when blank', () => {
    expect(serializeLocation({ field: '  ', lat: 1, lng: 2, radiusMi: 3 })).toEqual({
      location_filter: { field: DEFAULT_FIELD, lat: 1, lng: 2, distance: 3 },
    });
  });

  it('omits incomplete geo values (returns {})', () => {
    expect(serializeLocation({ field: 'location', lat: 31.75, lng: null, radiusMi: 10 })).toEqual(
      {}
    );
    expect(serializeLocation({ field: 'location', lat: Number.NaN, lng: 1, radiusMi: 1 })).toEqual(
      {}
    );
  });

  it('deserializes a location_filter object back into a geo value', () => {
    expect(deserializeLocation(MONGO_LOCATION)).toEqual(COMPLETE_GEO);
  });

  it('returns an empty geo value for missing or malformed filters', () => {
    const empty = { field: DEFAULT_FIELD, lat: null, lng: null, radiusMi: null };
    expect(deserializeLocation({})).toEqual(empty);
    expect(deserializeLocation({ location_filter: { bogus: true } })).toEqual(empty);
    expect(deserializeLocation({ location_filter: { lat: 'x', lng: 'y', distance: 'z' } })).toEqual(
      empty
    );
  });

  it('round-trips deserialize -> serialize', () => {
    const model = deserializeLocation(MONGO_LOCATION);
    expect(serializeLocation(model)).toEqual(MONGO_LOCATION);
  });
});

describe('MongoFilterBuilder component', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders the geo radius editor (map + radius input), no field rows', async () => {
    render(<MongoFilterBuilder />);
    expect(await screen.findByTestId('map-picker')).toBeTruthy();
    expect(screen.getByPlaceholderText('radius (mi)')).toBeTruthy();
    expect(screen.getByPlaceholderText('e.g. 31.75726')).toBeTruthy();
    // removed fields are gone
    expect(screen.queryByText('State')).toBeFalsy();
    expect(screen.queryByText('Gender')).toBeFalsy();
  });

  it('seeds inputs from an incoming value', () => {
    render(<MongoFilterBuilder value={MONGO_LOCATION} />);
    expect((screen.getByPlaceholderText('radius (mi)') as HTMLInputElement).value).toBe('10');
  });

  it('emits a recalculated location filter when the radius changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MongoFilterBuilder
        value={{ location_filter: { field: 'location', lat: 40, lng: -100, distance: 1 } }}
        onChange={onChange}
      />
    );

    const radiusInput = screen.getByPlaceholderText('radius (mi)');
    await user.clear(radiusInput);
    await user.type(radiusInput, '20');

    const lastCall = onChange.mock.calls.at(-1)?.[0] as MongoFilter;
    expect((lastCall.location_filter as Record<string, never>)['distance']).toBe(20);
    expect(serializeLocation({ field: 'location', lat: 40, lng: -100, radiusMi: 20 })).toEqual(
      lastCall
    );
  });

  it('adopts an externally-changed value', () => {
    const { rerender } = render(<MongoFilterBuilder value={{}} />);
    expect((screen.getByPlaceholderText('radius (mi)') as HTMLInputElement).value).toBe('');
    rerender(<MongoFilterBuilder value={MONGO_LOCATION} />);
    expect((screen.getByPlaceholderText('radius (mi)') as HTMLInputElement).value).toBe('10');
  });

  it('is enabled by default and shows the editor', async () => {
    render(<MongoFilterBuilder />);
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('true');
    expect(await screen.findByTestId('map-picker')).toBeTruthy();
  });

  it('hides the editor and emits {} when toggled off', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MongoFilterBuilder value={MONGO_LOCATION} onChange={onChange} />);
    expect(await screen.findByTestId('map-picker')).toBeTruthy();

    await user.click(screen.getByRole('switch'));

    expect(onChange).toHaveBeenLastCalledWith({});
    expect(screen.queryByTestId('map-picker')).toBeFalsy();
    expect(screen.queryByPlaceholderText('radius (mi)')).toBeFalsy();
  });

  it('re-emits the prior filter (no point lost) when toggled back on', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MongoFilterBuilder value={MONGO_LOCATION} onChange={onChange} />);

    const toggle = screen.getByRole('switch');
    await user.click(toggle); // off -> {}
    // simulate the parent feeding the emitted {} back in (round-trip)
    onChange.mockClear();
    await user.click(toggle); // on -> original filter, lat/lng/radius intact

    expect(onChange).toHaveBeenLastCalledWith(MONGO_LOCATION);
    expect((await screen.findByPlaceholderText('radius (mi)')) as HTMLInputElement).toBeTruthy();
    expect((screen.getByPlaceholderText('radius (mi)') as HTMLInputElement).value).toBe('10');
  });

  it('seeds default lat/lng/radius when re-enabled with no prior point', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MongoFilterBuilder value={{}} onChange={onChange} />);

    const toggle = screen.getByRole('switch');
    await user.click(toggle); // off -> {}
    await user.click(toggle); // on -> defaults

    expect(onChange).toHaveBeenLastCalledWith(serializeLocation(DEFAULT_GEO));
    expect((screen.getByPlaceholderText('radius (mi)') as HTMLInputElement).value).toBe(
      String(DEFAULT_GEO.radiusMi)
    );
  });
});
