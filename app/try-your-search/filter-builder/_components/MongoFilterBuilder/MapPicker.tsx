'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { Circle, MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';

const PIN_ICON = L.divIcon({
  className: '',
  html: `<svg viewBox="0 0 24 24" width="32" height="32" fill="#1677ff" stroke="#fff" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="10" r="3" fill="#fff" stroke="none"/>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
  </svg>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
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
      if (!disabled) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
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
      <MapClickHandler onMapClick={(lat, lng) => onCenterChange?.(lat, lng)} disabled={readOnly} />
      <Marker
        position={[center.lat, center.lng]}
        icon={PIN_ICON}
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
