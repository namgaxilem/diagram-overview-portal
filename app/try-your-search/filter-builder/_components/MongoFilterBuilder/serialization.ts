/**
 * Serialization / deserialization between the builder's internal editable
 * model and a valid MongoDB filter object.
 *
 * Kept free of React so the filter logic can be unit-tested in isolation.
 */

import type {
  EditableModel,
  EditableValue,
  FilterFieldDefinition,
  GeoRadiusValue,
  MongoFilter,
} from './types';

/** Earth radius in miles used to convert miles -> radians for $centerSphere. */
export const EARTH_RADIUS_MI = 3963.2;

function isGeoRadiusValue(v: EditableValue): v is GeoRadiusValue {
  return typeof v === 'object' && v !== null && 'lat' in v && 'lng' in v && 'radiusMi' in v;
}

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
 * Serialize a single field's editable value into the partial Mongo fragment it
 * contributes, or `null` when the value is incomplete/empty (so it is omitted).
 */
function serializeField(field: FilterFieldDefinition, value: EditableValue): MongoFilter | null {
  if (value === undefined || value === null) {
    return null;
  }

  switch (field.type) {
    case 'text':
    case 'select': {
      const str = String(value);
      if (str.trim() === '') {
        return null;
      }
      return { [field.name]: str };
    }
    case 'number': {
      if (value === ('' as unknown) || Number.isNaN(Number(value))) {
        return null;
      }
      return { [field.name]: Number(value) };
    }
    case 'geoRadius': {
      if (!isGeoRadiusValue(value) || !isCompleteGeo(value)) {
        return null;
      }
      return {
        [field.name]: {
          $geoWithin: {
            // MongoDB requires [lng, lat] order.
            $centerSphere: [[value.lng, value.lat], value.radiusMi / EARTH_RADIUS_MI],
          },
        },
      };
    }
    default:
      return null;
  }
}

/**
 * Build a valid MongoDB filter from the editable model.
 * Filters are combined with implicit AND (no `$and` wrapper).
 */
export function serializeFilters(
  fields: FilterFieldDefinition[],
  model: EditableModel
): MongoFilter {
  const fieldByName = new Map(fields.map((f) => [f.name, f]));
  const result: MongoFilter = {};

  for (const name of Object.keys(model)) {
    const field = fieldByName.get(name);
    if (!field) {
      continue;
    }
    const fragment = serializeField(field, model[name]);
    if (fragment) {
      Object.assign(result, fragment);
    }
  }

  return result;
}

/** Read a geoRadius fragment back into its editable value. */
function deserializeGeo(raw: unknown): GeoRadiusValue | null {
  const sphere = (raw as { $geoWithin?: { $centerSphere?: [[number, number], number] } })
    ?.$geoWithin?.$centerSphere;
  if (!Array.isArray(sphere)) {
    return null;
  }
  const [coords, radians] = sphere;
  if (!Array.isArray(coords)) {
    return null;
  }
  const [lng, lat] = coords;
  return {
    lat: typeof lat === 'number' ? lat : null,
    lng: typeof lng === 'number' ? lng : null,
    radiusMi: typeof radians === 'number' ? radians * EARTH_RADIUS_MI : null,
  };
}

/**
 * Convert a MongoDB filter object into the builder's editable model.
 * Only keys matching a known field definition are kept.
 */
export function deserializeFilters(
  fields: FilterFieldDefinition[],
  filter: MongoFilter
): EditableModel {
  const fieldByName = new Map(fields.map((f) => [f.name, f]));
  const model: EditableModel = {};

  for (const name of Object.keys(filter ?? {})) {
    const field = fieldByName.get(name);
    if (!field) {
      continue;
    }
    const raw = filter[name];

    switch (field.type) {
      case 'text':
      case 'select':
        model[name] = String(raw);
        break;
      case 'number':
        model[name] = Number(raw);
        break;
      case 'geoRadius': {
        const geo = deserializeGeo(raw);
        if (geo) {
          model[name] = geo;
        }
        break;
      }
    }
  }

  return model;
}
