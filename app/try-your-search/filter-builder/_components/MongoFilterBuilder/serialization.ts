/**
 * Serialization / deserialization between the builder's editable geo radius
 * value and a valid MongoDB location filter.
 *
 * Kept free of React so the filter logic can be unit-tested in isolation.
 */

import type { GeoRadiusValue, MongoFilter } from './types';

/** Earth radius in miles used to convert miles -> radians for $centerSphere. */
export const EARTH_RADIUS_MI = 3963.2;

/** Mongo document key the location radius filter maps to. */
export const LOCATION_KEY = 'location';

/** A geoRadius value is only serializable once all three numbers are present. */
function isCompleteGeo(v: GeoRadiusValue): v is { lat: number; lng: number; radiusMi: number } {
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
 * Serialize a geo radius draft into a MongoDB filter, or `{}` when the value is
 * incomplete (so it is omitted from the query).
 */
export function serializeLocation(value: GeoRadiusValue): MongoFilter {
  if (!isCompleteGeo(value)) {
    return {};
  }
  return {
    [LOCATION_KEY]: {
      $geoWithin: {
        // MongoDB requires [lng, lat] order.
        $centerSphere: [[value.lng, value.lat], value.radiusMi / EARTH_RADIUS_MI],
      },
    },
  };
}

/** Read a MongoDB location filter back into its editable geo radius value. */
export function deserializeLocation(filter: MongoFilter): GeoRadiusValue {
  const empty: GeoRadiusValue = { lat: null, lng: null, radiusMi: null };
  const sphere = (
    filter?.[LOCATION_KEY] as
      | { $geoWithin?: { $centerSphere?: [[number, number], number] } }
      | undefined
  )?.$geoWithin?.$centerSphere;

  if (!Array.isArray(sphere)) {
    return empty;
  }
  const [coords, radians] = sphere;
  if (!Array.isArray(coords)) {
    return empty;
  }
  const [lng, lat] = coords;
  return {
    lat: typeof lat === 'number' ? lat : null,
    lng: typeof lng === 'number' ? lng : null,
    radiusMi: typeof radians === 'number' ? radians * EARTH_RADIUS_MI : null,
  };
}
