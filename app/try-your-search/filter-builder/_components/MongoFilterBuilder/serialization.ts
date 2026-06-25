/**
 * Serialization / deserialization between the builder's editable geo radius
 * value and a `location_filter` object.
 *
 * Kept free of React so the filter logic can be unit-tested in isolation.
 */

import type { GeoRadiusValue, MongoFilter } from './types';

/** Field name used when the user leaves the field input blank. */
export const DEFAULT_FIELD = 'location';

/** Top-level key the location radius filter maps to. */
export const LOCATION_FILTER_KEY = 'location_filter';

/**
 * Seed value used when the filter is (re)enabled with no usable point yet —
 * geographic center of the contiguous US with a 10 mi radius.
 */
export const DEFAULT_GEO: GeoRadiusValue = {
  field: DEFAULT_FIELD,
  lat: 39.8283,
  lng: -98.5795,
  radiusMi: 10,
};

/** A geoRadius value is only serializable once all three numbers are present. */
export function isCompleteGeo(
  v: GeoRadiusValue
): v is GeoRadiusValue & { lat: number; lng: number; radiusMi: number } {
  return (
    typeof v.lat === 'number' &&
    typeof v.lng === 'number' &&
    typeof v.radiusMi === 'number' &&
    !Number.isNaN(v.lat) &&
    !Number.isNaN(v.lng) &&
    !Number.isNaN(v.radiusMi)
  );
}

/**
 * Serialize a geo radius draft into a `location_filter` object, or `{}` when the
 * value is incomplete (so it is omitted from the query).
 */
export function serializeLocation(value: GeoRadiusValue): MongoFilter {
  if (!isCompleteGeo(value)) {
    return {};
  }
  return {
    [LOCATION_FILTER_KEY]: {
      field: value.field?.trim() || DEFAULT_FIELD,
      lat: value.lat,
      lng: value.lng,
      distance: value.radiusMi,
    },
  };
}

/** Read a `location_filter` object back into its editable geo radius value. */
export function deserializeLocation(filter: MongoFilter): GeoRadiusValue {
  const empty: GeoRadiusValue = {
    field: DEFAULT_FIELD,
    lat: null,
    lng: null,
    radiusMi: null,
  };

  const lf = filter?.[LOCATION_FILTER_KEY] as
    | { field?: unknown; lat?: unknown; lng?: unknown; distance?: unknown }
    | undefined;

  if (!lf || typeof lf !== 'object') {
    return empty;
  }

  return {
    field: typeof lf.field === 'string' && lf.field ? lf.field : DEFAULT_FIELD,
    lat: typeof lf.lat === 'number' ? lf.lat : null,
    lng: typeof lf.lng === 'number' ? lf.lng : null,
    radiusMi: typeof lf.distance === 'number' ? lf.distance : null,
  };
}
