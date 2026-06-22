import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MapPicker from './MapPicker';

let capturedHandlers: Record<string, unknown> = {};

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children, style }: Record<string, unknown>) => (
    <div data-testid="map-container" style={style as object}>
      {children as never}
    </div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ position, draggable, eventHandlers }: Record<string, unknown>) => {
    capturedHandlers = {
      ...capturedHandlers,
      ...((eventHandlers as Record<string, unknown>) || {}),
    };
    return (
      <div
        data-testid="marker"
        data-pos={JSON.stringify(position)}
        data-draggable={String(draggable)}
      />
    );
  },
  Circle: ({ radius }: Record<string, unknown>) => (
    <div data-testid="circle" data-radius={String(radius)} />
  ),
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

  it('renders map container, tile layer and marker', () => {
    render(<MapPicker center={center} radius={radius} />);
    expect(screen.getByTestId('map-container')).toBeTruthy();
    expect(screen.getByTestId('tile-layer')).toBeTruthy();
    expect(screen.getByTestId('marker')).toBeTruthy();
  });

  it('renders circle when radius > 0', () => {
    render(<MapPicker center={center} radius={radius} />);
    expect(screen.getByTestId('circle')).toBeTruthy();
  });

  it('does not render circle when radius is 0', () => {
    render(<MapPicker center={center} radius={{ value: 0, unit: 'km' }} />);
    expect(screen.queryByTestId('circle')).toBeFalsy();
  });

  it('converts mi unit to meters for the circle radius', () => {
    render(<MapPicker center={center} radius={{ value: 1, unit: 'mi' }} />);
    expect(screen.getByTestId('circle').dataset.radius).toBe('1609.344');
  });

  it('falls back to km factor for an unknown unit', () => {
    render(<MapPicker center={center} radius={{ value: 2, unit: 'parsec' }} />);
    expect(screen.getByTestId('circle').dataset.radius).toBe('2000');
  });

  it('marker is not draggable in readOnly', () => {
    render(<MapPicker center={center} radius={radius} readOnly />);
    expect(screen.getByTestId('marker').dataset.draggable).toBe('false');
  });

  it('marker is draggable when not readOnly', () => {
    render(<MapPicker center={center} radius={radius} />);
    expect(screen.getByTestId('marker').dataset.draggable).toBe('true');
  });

  it('triggers onCenterChange on map click', () => {
    const onCenterChange = vi.fn();
    render(<MapPicker center={center} radius={radius} onCenterChange={onCenterChange} />);
    const clickFn = capturedHandlers.click as
      | ((e: { latlng: { lat: number; lng: number } }) => void)
      | undefined;
    clickFn?.({ latlng: { lat: 20, lng: 30 } });
    expect(onCenterChange).toHaveBeenCalledWith(20, 30);
  });

  it('does not trigger onCenterChange when readOnly', () => {
    const onCenterChange = vi.fn();
    render(<MapPicker center={center} radius={radius} onCenterChange={onCenterChange} readOnly />);
    const clickFn = capturedHandlers.click as
      | ((e: { latlng: { lat: number; lng: number } }) => void)
      | undefined;
    clickFn?.({ latlng: { lat: 20, lng: 30 } });
    expect(onCenterChange).not.toHaveBeenCalled();
  });

  it('triggers onCenterChange on marker dragend', () => {
    const onCenterChange = vi.fn();
    render(<MapPicker center={center} radius={radius} onCenterChange={onCenterChange} />);
    const dragendFn = capturedHandlers.dragend as
      | ((e: { target: { getLatLng: () => { lat: number; lng: number } } }) => void)
      | undefined;
    dragendFn?.({ target: { getLatLng: () => ({ lat: 15, lng: 25 }) } });
    expect(onCenterChange).toHaveBeenCalledWith(15, 25);
  });
});
