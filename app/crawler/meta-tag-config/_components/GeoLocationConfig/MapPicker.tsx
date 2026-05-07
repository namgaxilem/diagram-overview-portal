'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { Circle, MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const UNIT_TO_METERS: Record<string, number> = {
  m: 1,
  km: 1000,
  mi: 1609.344,
};

function MapClickHandler({
  onMapClick,
  disabled,
}: {
  onMapClick: (lat: number, lng: number) => void;
  disabled?: boolean;
}) {
  useMapEvents({
    click(e) {
      if (!disabled) onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.panTo([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

export interface MapPickerProps {
  center: { lat: number; lng: number };
  radius: { value: number; unit: string };
  onCenterChange?: (lat: number, lng: number) => void;
  readOnly?: boolean;
}

export default function MapPicker({
  center,
  radius,
  onCenterChange,
  readOnly = false,
}: MapPickerProps) {
  const radiusInMeters = (radius.value || 0) * (UNIT_TO_METERS[radius.unit] ?? 1000);

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={12}
      style={{ height: 350, width: '100%', cursor: readOnly ? 'default' : 'crosshair' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <RecenterMap lat={center.lat} lng={center.lng} />
      <MapClickHandler
        onMapClick={(lat, lng) => onCenterChange?.(lat, lng)}
        disabled={readOnly}
      />
      <Marker
        position={[center.lat, center.lng]}
        draggable={!readOnly}
        eventHandlers={
          readOnly
            ? {}
            : {
                dragend(e) {
                  const pos = (e.target as L.Marker).getLatLng();
                  onCenterChange?.(pos.lat, pos.lng);
                },
              }
        }
      />
      {radiusInMeters > 0 && (
        <Circle
          center={[center.lat, center.lng]}
          radius={radiusInMeters}
          pathOptions={{
            color: '#1677ff',
            fillColor: '#1677ff',
            fillOpacity: 0.1,
            weight: 2,
          }}
        />
      )}
    </MapContainer>
  );
}
