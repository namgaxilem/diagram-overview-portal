'use client';

import { memo } from 'react';
import dynamic from 'next/dynamic';
import { Input, InputNumber, Spin, Tag, Tooltip, Typography } from 'antd';
import { AimOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { GeoRadiusValue } from './types';
import { DEFAULT_FIELD } from './serialization';

const { Text } = Typography;

const MapLoading = () => (
  <div
    className="flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200"
    style={{ height: 350 }}
  >
    <Spin tip="Loading map..." />
  </div>
);

/**
 * Loaded client-only via next/dynamic (ssr:false) so leaflet — which touches
 * `window` at module load — is never evaluated during server rendering. React's
 * `lazy` is not enough here: it still resolves on the server during prerender,
 * which is what caused the "window is not defined" build error.
 */
const MapPicker = dynamic(() => import('./MapPicker'), {
  ssr: false,
  loading: () => <MapLoading />,
});

export interface GeoRadiusEditorProps {
  value?: GeoRadiusValue;
  onChange?: (value: GeoRadiusValue) => void;
  disabled?: boolean;
}

const EMPTY: GeoRadiusValue = { field: DEFAULT_FIELD, lat: null, lng: null, radiusMi: null };

/** Fallback map center (geographic center of contiguous US) when no point set. */
const DEFAULT_CENTER = { lat: 39.8283, lng: -98.5795 };

/**
 * Editor for a geo radius filter: an interactive map plus latitude, longitude,
 * and radius (km) inputs. Stays controlled — emits the full triple on change.
 */
function GeoRadiusEditor({ value = EMPTY, onChange, disabled }: GeoRadiusEditorProps) {
  const update = (patch: Partial<GeoRadiusValue>) => {
    onChange?.({ ...value, ...patch });
  };

  const mapCenter = {
    lat: value.lat ?? DEFAULT_CENTER.lat,
    lng: value.lng ?? DEFAULT_CENTER.lng,
  };

  const handleCenterChange = (lat: number, lng: number) => {
    update({
      lat: parseFloat(lat.toFixed(6)),
      lng: parseFloat(lng.toFixed(6)),
    });
  };

  return (
    <div className="space-y-3">
      <div>
        <Text className="text-xs text-gray-500">
          <AimOutlined className="mr-1" />
          Click the map or drag the marker to set the center point. The blue circle is the search
          radius.
        </Text>
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-200">
        <MapPicker
          center={mapCenter}
          radius={{ value: value.radiusMi ?? 0, unit: 'mi' }}
          onCenterChange={handleCenterChange}
          readOnly={disabled}
        />
      </div>

      <Input
        className="w-full"
        value={value.field}
        onChange={(e) => update({ field: e.target.value })}
        disabled={disabled}
        placeholder={DEFAULT_FIELD}
        addonBefore={
          <Tooltip
            title={`Document field the geo filter targets (the column searched). Leave blank to default to "${DEFAULT_FIELD}".`}
          >
            <span className="inline-flex items-center">
              <Tag color="purple" className="!m-0">
                FIELD
              </Tag>
              <QuestionCircleOutlined className="ml-1 text-gray-400" />
            </span>
          </Tooltip>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <InputNumber
          className="w-full"
          value={value.lat}
          onChange={(val) => update({ lat: val })}
          min={-90}
          max={90}
          step={0.0001}
          precision={6}
          disabled={disabled}
          addonBefore={
            <Tag color="blue" className="!m-0">
              LAT
            </Tag>
          }
          placeholder="e.g. 31.75726"
        />
        <InputNumber
          className="w-full"
          value={value.lng}
          onChange={(val) => update({ lng: val })}
          min={-180}
          max={180}
          step={0.0001}
          precision={6}
          disabled={disabled}
          addonBefore={
            <Tag color="green" className="!m-0">
              LNG
            </Tag>
          }
          placeholder="e.g. -106.345542"
        />
        <InputNumber
          className="w-full"
          value={value.radiusMi}
          onChange={(val) => update({ radiusMi: val })}
          min={0}
          step={1}
          disabled={disabled}
          addonBefore={
            <Tag color="orange" className="!m-0">
              MI
            </Tag>
          }
          placeholder="radius (mi)"
        />
      </div>
    </div>
  );
}

export default memo(GeoRadiusEditor);
