/**
 * Type definitions for the MongoFilterBuilder component.
 */

export type FilterFieldType = 'text' | 'select' | 'number' | 'geoRadius';

export interface SelectOption {
  label: string;
  value: string;
}

export interface FilterFieldDefinition {
  /** Mongo document key this field maps to (e.g. "doctor_address_state"). */
  name: string;
  /** Human-readable label shown in the UI. */
  label: string;
  /** Field editor type. */
  type: FilterFieldType;
  /** Options for `select` type. */
  options?: SelectOption[];
  /** Optional placeholder for text/number inputs. */
  placeholder?: string;
}

/** Editable value held while a geoRadius filter is being constructed. */
export interface GeoRadiusValue {
  lat: number | null;
  lng: number | null;
  radiusMi: number | null;
}

/** The internal, possibly-incomplete editable value for a single field. */
export type EditableValue = string | number | GeoRadiusValue | null | undefined;

/** Internal editable model: field name -> editable value. */
export type EditableModel = Record<string, EditableValue>;

/** A serialized MongoDB filter object. */
export type MongoFilter = Record<string, unknown>;
