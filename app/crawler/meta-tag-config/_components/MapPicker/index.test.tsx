import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MapPicker from './index';

let capturedHandlers: Record<string, unknown> = {};

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children, style }: Record<string, unknown>) =>
    React.createElement('div', { 'data-testid': 'map-container', style }, children),
  TileLayer: () => React.createElement('div', { 'data-testid': 'tile-layer' }),
  Marker: ({ position, draggable, icon, eventHandlers }: Record<string, unknown>) => {
    capturedHandlers = { ...capturedHandlers, ...(eventHandlers as Record<string, unknown> || {}) };
    return React.createElement('div', {
      'data-testid': 'marker',
      'data-pos': JSON.stringify(position),
      'data-draggable': String(draggable),
    });
  },
  Circle: ({ center, radius, pathOptions }: Record<string, unknown>) =>
    React.createElement('div', { 'data-testid': 'circle', 'data-radius': String(radius) }),
  useMap: () => ({ panTo: vi.fn() }),
  useMapEvents: (opts: Record<string, unknown>) => {
    capturedHandlers = { ...capturedHandlers, ...opts };
    return null;
  },
}));

vi.mock('leaflet', () => ({
  default: {
    divIcon: () => ({ options: {} }),
    Icon: { Default: { prototype: {} } },
  },
}));

describe('MapPicker', () => {
  const center = { lat: 10, lng: 106 };
  const radius = { value: 5, unit: 'km' };

  it('renders map container', () => {
    render(React.createElement(MapPicker, { center, radius }));
    expect(screen.getByTestId('map-container')).toBeTruthy();
  });

  it('renders marker at center', () => {
    render(React.createElement(MapPicker, { center, radius }));
    const marker = screen.getByTestId('marker');
    expect(marker).toBeTruthy();
  });

  it('renders circle when radius > 0', () => {
    render(React.createElement(MapPicker, { center, radius }));
    expect(screen.getByTestId('circle')).toBeTruthy();
  });

  it('does not render circle when radius is 0', () => {
    render(React.createElement(MapPicker, { center, radius: { value: 0, unit: 'km' } }));
    expect(screen.queryByTestId('circle')).toBeFalsy();
  });

  it('marker is not draggable in readOnly', () => {
    render(React.createElement(MapPicker, { center, radius, readOnly: true }));
    expect(screen.getByTestId('marker').dataset.draggable).toBe('false');
  });

  it('marker is draggable when not readOnly', () => {
    render(React.createElement(MapPicker, { center, radius }));
    expect(screen.getByTestId('marker').dataset.draggable).toBe('true');
  });

  it('renders with onCenterChange callback', () => {
    const onCenterChange = vi.fn();
    render(React.createElement(MapPicker, { center, radius, onCenterChange }));
    expect(screen.getByTestId('map-container')).toBeTruthy();
  });

  it('renders tile layer', () => {
    render(React.createElement(MapPicker, { center, radius }));
    expect(screen.getByTestId('tile-layer')).toBeTruthy();
  });

  it('triggers onCenterChange on map click', () => {
    const onCenterChange = vi.fn();
    render(React.createElement(MapPicker, { center, radius, onCenterChange }));
    const clickFn = capturedHandlers.click as ((e: { latlng: { lat: number; lng: number } }) => void) | undefined;
    if (clickFn) clickFn({ latlng: { lat: 20, lng: 30 } });
    expect(onCenterChange).toHaveBeenCalledWith(20, 30);
  });

  it('does not trigger onCenterChange when disabled', () => {
    const onCenterChange = vi.fn();
    render(React.createElement(MapPicker, { center, radius, onCenterChange, readOnly: true }));
    const clickFn = capturedHandlers.click as ((e: { latlng: { lat: number; lng: number } }) => void) | undefined;
    if (clickFn) clickFn({ latlng: { lat: 20, lng: 30 } });
    expect(onCenterChange).not.toHaveBeenCalled();
  });

  it('triggers onCenterChange on marker dragend', () => {
    const onCenterChange = vi.fn();
    render(React.createElement(MapPicker, { center, radius, onCenterChange }));
    const dragendFn = capturedHandlers.dragend as ((e: { target: { getLatLng: () => { lat: number; lng: number } } }) => void) | undefined;
    if (dragendFn) dragendFn({ target: { getLatLng: () => ({ lat: 15, lng: 25 }) } });
    expect(onCenterChange).toHaveBeenCalledWith(15, 25);
  });
});
