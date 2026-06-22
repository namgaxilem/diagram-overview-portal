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
  EARTH_RADIUS_MI,
  LOCATION_KEY,
} from './serialization';
import type { MongoFilter } from './types';

const COMPLETE_GEO = { lat: 31.75726, lng: -106.345542, radiusMi: 10 };
const MONGO_LOCATION: MongoFilter = {
  location: {
    $geoWithin: { $centerSphere: [[-106.345542, 31.75726], 10 / EARTH_RADIUS_MI] },
  },
};

describe('MongoFilterBuilder serialization', () => {
  it('uses "location" as the document key', () => {
    expect(LOCATION_KEY).toBe('location');
  });

  it('serializes a complete geo value into a $centerSphere filter', () => {
    expect(serializeLocation(COMPLETE_GEO)).toEqual(MONGO_LOCATION);
  });

  it('omits incomplete geo values (returns {})', () => {
    expect(serializeLocation({ lat: 31.75, lng: null, radiusMi: 10 })).toEqual({});
    expect(serializeLocation({ lat: Number.NaN, lng: 1, radiusMi: 1 })).toEqual({});
  });

  it('deserializes a $centerSphere filter back into a geo value', () => {
    expect(deserializeLocation(MONGO_LOCATION)).toEqual(COMPLETE_GEO);
  });

  it('returns an empty geo value for missing or malformed filters', () => {
    const empty = { lat: null, lng: null, radiusMi: null };
    expect(deserializeLocation({})).toEqual(empty);
    expect(deserializeLocation({ location: { bogus: true } })).toEqual(empty);
    expect(deserializeLocation({ location: { $geoWithin: { $centerSphere: ['x', 1] } } })).toEqual(
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
        value={{ location: { $geoWithin: { $centerSphere: [[-100, 40], 0.01] } } }}
        onChange={onChange}
      />
    );

    const radiusInput = screen.getByPlaceholderText('radius (mi)');
    await user.clear(radiusInput);
    await user.type(radiusInput, '20');

    const lastCall = onChange.mock.calls.at(-1)?.[0] as MongoFilter;
    expect((lastCall.location as Record<string, never>)['$geoWithin']).toBeTruthy();
    expect(serializeLocation({ lat: 40, lng: -100, radiusMi: 20 })).toEqual(lastCall);
  });

  it('adopts an externally-changed value', () => {
    const { rerender } = render(<MongoFilterBuilder value={{}} />);
    expect((screen.getByPlaceholderText('radius (mi)') as HTMLInputElement).value).toBe('');
    rerender(<MongoFilterBuilder value={MONGO_LOCATION} />);
    expect((screen.getByPlaceholderText('radius (mi)') as HTMLInputElement).value).toBe('10');
  });
});
