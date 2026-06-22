'use client';

import { memo, useState } from 'react';

import GeoRadiusEditor from './GeoRadiusEditor';
import { deserializeLocation, serializeLocation } from './serialization';
import type { GeoRadiusValue, MongoFilter } from './types';

export interface MongoFilterBuilderProps {
  /** Current MongoDB filter. Only the `location` key is read/written. */
  value?: MongoFilter;
  /** Called with the recomputed MongoDB filter whenever the radius changes. */
  onChange?: (value: MongoFilter) => void;
}

/**
 * Builds the `location` geo-radius fragment of a MongoDB filter. Self-contained:
 * copy this folder into any React (Vite/Next) app and render `<MongoFilterBuilder />`.
 */
function MongoFilterBuilder({ value, onChange }: MongoFilterBuilderProps) {
  const [geo, setGeo] = useState<GeoRadiusValue>(() => deserializeLocation(value ?? {}));

  // Adopt external value during render (no effect needed) when it differs from
  // what we last emitted, so an out-of-band `value` change is reflected.
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    const incoming = value ?? {};
    if (JSON.stringify(serializeLocation(geo)) !== JSON.stringify(incoming)) {
      setGeo(deserializeLocation(incoming));
    }
  }

  const handleChange = (next: GeoRadiusValue) => {
    setGeo(next);
    onChange?.(serializeLocation(next));
  };

  return <GeoRadiusEditor value={geo} onChange={handleChange} />;
}

export default memo(MongoFilterBuilder);

export {
  serializeLocation,
  deserializeLocation,
  EARTH_RADIUS_MI,
  LOCATION_KEY,
} from './serialization';
export type { GeoRadiusValue, MongoFilter } from './types';
