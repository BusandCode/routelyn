import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { TrackingData } from '../types';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function FitBounds({ data }: { data: TrackingData }) {
  const map = useMap();
  useEffect(() => {
    const pts: [number, number][] = [
      [data.pickup.latitude, data.pickup.longitude],
      [data.destination.latitude, data.destination.longitude],
    ];
    if (data.currentLocation) pts.push([data.currentLocation.latitude, data.currentLocation.longitude]);
    data.events.forEach((e) => { if (e.latitude != null && e.longitude != null) pts.push([e.latitude, e.longitude]); });
    if (pts.length > 1) map.fitBounds(pts, { padding: [40, 40] });
    else if (pts.length === 1) map.setView(pts[0], 12);
  }, [data, map]);
  return null;
}

export function TrackingMap({ data }: { data: TrackingData }) {
  const center: [number, number] = data.currentLocation
    ? [data.currentLocation.latitude, data.currentLocation.longitude]
    : [data.pickup.latitude, data.pickup.longitude];

  const routePoints: [number, number][] = [
    [data.pickup.latitude, data.pickup.longitude],
    ...data.events.filter((e) => e.latitude != null && e.longitude != null).map((e) => [e.latitude!, e.longitude!] as [number, number]),
  ];
  if (data.currentLocation) routePoints.push([data.currentLocation.latitude, data.currentLocation.longitude]);
  routePoints.push([data.destination.latitude, data.destination.longitude]);

  return (
    <MapContainer center={center} zoom={11} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
      <TileLayer attribution='© OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FitBounds data={data} />
      <Polyline positions={routePoints} pathOptions={{ color: '#27a862', weight: 4, dashArray: '2 10', lineCap: 'round', opacity: 0.9 }} />
      <Marker position={[data.pickup.latitude, data.pickup.longitude]}>
        <Popup><strong>Pickup</strong><br />{data.pickup.address}</Popup>
      </Marker>
      <Marker position={[data.destination.latitude, data.destination.longitude]}>
        <Popup><strong>Destination</strong><br />{data.destination.address}</Popup>
      </Marker>
      {data.currentLocation && (
        <Marker position={[data.currentLocation.latitude, data.currentLocation.longitude]}>
          <Popup>
            <strong>Current location</strong><br />
            Updated: {new Date(data.currentLocation.updatedAt).toLocaleString()}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}