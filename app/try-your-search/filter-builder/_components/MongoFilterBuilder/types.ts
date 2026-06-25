/**
 * Type definitions for the MongoFilterBuilder component.
 */

/** Editable value held while a geo radius filter is being constructed. */
export interface GeoRadiusValue {
  /** Document field the geo filter targets. Empty falls back to the default. */
  field: string;
  lat: number | null;
  lng: number | null;
  radiusMi: number | null;
}

/** A serialized MongoDB filter object. */
export type MongoFilter = Record<string, unknown>;
