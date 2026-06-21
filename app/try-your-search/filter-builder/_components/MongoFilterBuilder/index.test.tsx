import React, { useState } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Stub the dynamically-imported MapPicker so leaflet is never loaded in tests.
vi.mock('next/dynamic', () => ({
  default: () => {
    const Comp = () => React.createElement('div', { 'data-testid': 'map-picker' }, 'Map');
    Comp.displayName = 'MapPicker';
    return Comp;
  },
}));

import MongoFilterBuilder from './index';
import {
  serializeFilters,
  deserializeFilters,
  EARTH_RADIUS_MI,
} from './serialization';
import type { FilterFieldDefinition, MongoFilter } from './types';

const FIELDS: FilterFieldDefinition[] = [
  {
    name: 'doctor_address_state',
    label: 'State',
    type: 'select',
    options: [
      { label: 'Texas', value: 'TX' },
      { label: 'California', value: 'CA' },
    ],
  },
  { name: 'doctor_gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'Male' }] },
  { name: 'location', label: 'Location Radius', type: 'geoRadius' },
];

// Controlled wrapper so onChange round-trips back into value, like real usage.
function Harness({ initial = {} as MongoFilter, onChange }: { initial?: MongoFilter; onChange?: (v: MongoFilter) => void }) {
  const [filter, setFilter] = useState<MongoFilter>(initial);
  return React.createElement(MongoFilterBuilder, {
    value: filter,
    fields: FIELDS,
    onChange: (v: MongoFilter) => {
      setFilter(v);
      onChange?.(v);
    },
  });
}

describe('MongoFilterBuilder serialization', () => {
  it('serializes select fields with implicit AND (no $and wrapper)', () => {
    const out = serializeFilters(FIELDS, {
      doctor_address_state: 'TX',
      doctor_gender: 'Male',
    });
    expect(out).toEqual({ doctor_address_state: 'TX', doctor_gender: 'Male' });
  });

  it('converts geo radius miles -> radians using EARTH_RADIUS_MI', () => {
    const out = serializeFilters(FIELDS, {
      location: { lat: 31.75726, lng: -106.345542, radiusMi: 10 },
    });
    expect(out).toEqual({
      location: {
        $geoWithin: {
          $centerSphere: [[-106.345542, 31.75726], 10 / EARTH_RADIUS_MI],
        },
      },
    });
  });

  it('omits incomplete geo radius values', () => {
    const out = serializeFilters(FIELDS, {
      location: { lat: 31.75, lng: null, radiusMi: 10 },
    });
    expect(out).toEqual({});
  });

  it('round-trips through deserialize -> serialize', () => {
    const mongo: MongoFilter = {
      doctor_address_state: 'CA',
      location: { $geoWithin: { $centerSphere: [[-100, 40], 0.01] } },
    };
    const model = deserializeFilters(FIELDS, mongo);
    expect(model.doctor_address_state).toBe('CA');
    expect(serializeFilters(FIELDS, model)).toEqual(mongo);
  });
});

describe('MongoFilterBuilder component', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders one row per field (no Add Filter button)', () => {
    render(React.createElement(Harness));
    expect(screen.getByText('State')).toBeTruthy();
    expect(screen.getByText('Gender')).toBeTruthy();
    expect(screen.getByText('Location Radius')).toBeTruthy();
    expect(screen.queryByText('Add Filter')).toBeFalsy();
  });

  it('does not render removed fields', () => {
    render(React.createElement(Harness));
    expect(screen.queryByText('Name')).toBeFalsy();
    expect(screen.queryByText('Years of Experience')).toBeFalsy();
  });

  it('renders the map picker for the geoRadius field', () => {
    render(React.createElement(Harness));
    expect(screen.getByTestId('map-picker')).toBeTruthy();
  });

  it('emits a recalculated geo filter when the radius input changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      React.createElement(Harness, {
        initial: { location: { $geoWithin: { $centerSphere: [[-100, 40], 0.01] } } },
        onChange,
      })
    );

    const radiusInput = screen.getByPlaceholderText('radius (mi)');
    await user.clear(radiusInput);
    await user.type(radiusInput, '20');

    const lastCall = onChange.mock.calls.at(-1)?.[0];
    expect(lastCall.location.$geoWithin.$centerSphere).toEqual([
      [-100, 40],
      20 / EARTH_RADIUS_MI,
    ]);
  });
});
