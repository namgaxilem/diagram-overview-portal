'use client';

import { memo, useState } from 'react';
import { Switch, Tooltip, Typography } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import GeoRadiusEditor from './GeoRadiusEditor';
import { DEFAULT_GEO, deserializeLocation, isCompleteGeo, serializeLocation } from './serialization';
import type { GeoRadiusValue, MongoFilter } from './types';

const { Text } = Typography;

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
  // When off, the builder is hidden and no filter is emitted (`{}`).
  const [enabled, setEnabled] = useState(true);

  // Adopt external value during render (no effect needed) when it differs from
  // what we last emitted, so an out-of-band `value` change is reflected. Skip
  // while disabled — we emit `{}` in that state, and adopting it back would wipe
  // the in-progress point so re-enabling would lose lat/lng/radius.
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    if (enabled) {
      const incoming = value ?? {};
      if (JSON.stringify(serializeLocation(geo)) !== JSON.stringify(incoming)) {
        setGeo(deserializeLocation(incoming));
      }
    }
  }

  const handleChange = (next: GeoRadiusValue) => {
    setGeo(next);
    onChange?.(serializeLocation(next));
  };

  const handleToggle = (on: boolean) => {
    setEnabled(on);
    if (!on) {
      onChange?.({});
      return;
    }
    // Re-enabling: keep the prior point, or seed sensible defaults if none yet.
    const next = isCompleteGeo(geo) ? geo : DEFAULT_GEO;
    setGeo(next);
    onChange?.(serializeLocation(next));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Switch checked={enabled} onChange={handleToggle} />
        <Text strong>Location filter</Text>
        <Tooltip title="Turn off to omit the location filter from the query (produces {}).">
          <QuestionCircleOutlined className="text-gray-400" />
        </Tooltip>
      </div>

      {enabled && <GeoRadiusEditor value={geo} onChange={handleChange} />}
    </div>
  );
}

export default memo(MongoFilterBuilder);

export {
  serializeLocation,
  deserializeLocation,
  DEFAULT_FIELD,
  LOCATION_FILTER_KEY,
} from './serialization';
export type { GeoRadiusValue, MongoFilter } from './types';
