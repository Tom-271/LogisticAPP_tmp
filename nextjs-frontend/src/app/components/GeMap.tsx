'use client';

import * as React from 'react';
import { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Popup,
  FeatureGroup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-semicircle';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression, PathOptions } from 'leaflet';

// === Coordinate ===
const GENOVA: LatLngExpression = [44.4056, 8.9463];

// === Stili ===
const fillGreenOptions: PathOptions = { fillColor: 'green', color: 'green' };

// === Componente per il semicerchio ===
type SemiCircleProps = {
  center: [number, number];
  radius: number;
  startAngle: number;
  stopAngle: number;
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  weight?: number;
  dashArray?: string;
};

function SemiCircle({
  center,
  radius,
  startAngle,
  stopAngle,
  color = '#3b82f6',
  fillColor = '#3b82f6',
  fillOpacity = 0.3,
  weight = 1,
  dashArray,
}: SemiCircleProps) {
  const map = useMap();

  useEffect(() => {
    // @ts-expect-error semiCircle dal plugin
    const layer = L.semiCircle(center, {
      radius,
      startAngle,
      stopAngle,
      color,
      fillColor,
      fillOpacity,
      weight,
      dashArray,
    }).addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, center, radius, startAngle, stopAngle, color, fillColor, fillOpacity, weight, dashArray]);

  return null;
}

// === Componente principale ===
export default function GeMap({ radius = 7500 }: { radius?: number }) {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-md">
      <MapContainer
        center={GENOVA}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: '550px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Anello esterno grigio — perimetro tratteggiato */}
        <SemiCircle
          key={`outer-${radius}`}
          center={[44.3970, 8.9463]}
          radius={radius + 2000}
          startAngle={-78}
          stopAngle={-78 + 180}
          color="#6b7280"
          fillColor="#6b7280"
          fillOpacity={0.25}
          weight={2}
          dashArray="8 6"
        />

        {/* Area di copertura principale — blu */}
        <SemiCircle
          key={`inner-${radius}`}
          center={[44.3970, 8.9463]}
          radius={radius}
          startAngle={-78}
          stopAngle={-78 + 180}
          color="#3b82f6"
          fillColor="#3b82f6"
          fillOpacity={0.3}
          weight={1}
        />

       
      </MapContainer>
    </div>
  );
}