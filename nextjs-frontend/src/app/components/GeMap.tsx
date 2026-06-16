'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';

const GENOVA_LNG = 8.9463;
const GENOVA_LAT = 44.4056;
const SEMI_LAT = 44.3970;
const SEMI_LNG = 8.9463;
const START_ANGLE = -78;
const STOP_ANGLE = 102;

function semiCircleGeoJSON(
  centerLat: number,
  centerLng: number,
  radiusM: number,
  startDeg: number,
  stopDeg: number,
  steps = 64,
) {
  const R = 6371000;
  const latRad = (centerLat * Math.PI) / 180;
  const coords: [number, number][] = [[centerLng, centerLat]];

  for (let i = 0; i <= steps; i++) {
    const bearing = ((startDeg + ((stopDeg - startDeg) * i) / steps) * Math.PI) / 180;
    const dLat = (radiusM / R) * Math.cos(bearing);
    const dLng = (radiusM / R) * Math.sin(bearing) / Math.cos(latRad);
    coords.push([
      centerLng + (dLng * 180) / Math.PI,
      centerLat + (dLat * 180) / Math.PI,
    ]);
  }

  coords.push([centerLng, centerLat]);

  return {
    type: 'Feature' as const,
    geometry: { type: 'Polygon' as const, coordinates: [coords] },
    properties: {},
  };
}

const OSM_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [{ id: 'osm-layer', type: 'raster', source: 'osm' }],
};

export default function GeMap({ radius = 7500, showCircles = false }: { radius?: number; showCircles?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OSM_STYLE,
      center: [GENOVA_LNG, GENOVA_LAT],
      zoom: 11,
      scrollZoom: false,
    });

    mapRef.current = map;
    map.on('load', () => setMapLoaded(true));

    return () => {
      map.remove();
      mapRef.current = null;
      setMapLoaded(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const LAYERS = ['outer-fill', 'outer-border', 'inner-fill', 'inner-border'];
    const SOURCES = ['outer-semi', 'inner-semi'];

    LAYERS.forEach((id) => { if (map.getLayer(id)) map.removeLayer(id); });
    SOURCES.forEach((id) => { if (map.getSource(id)) map.removeSource(id); });

    if (!showCircles) return;

    const outer = semiCircleGeoJSON(SEMI_LAT, SEMI_LNG, radius + 2000, START_ANGLE, STOP_ANGLE);
    const inner = semiCircleGeoJSON(SEMI_LAT, SEMI_LNG, radius, START_ANGLE, STOP_ANGLE);

    map.addSource('outer-semi', { type: 'geojson', data: outer });
    map.addLayer({ id: 'outer-fill', type: 'fill', source: 'outer-semi', paint: { 'fill-color': '#6b7280', 'fill-opacity': 0.25 } });
    map.addLayer({ id: 'outer-border', type: 'line', source: 'outer-semi', paint: { 'line-color': '#6b7280', 'line-width': 2, 'line-dasharray': [8, 6] } });

    map.addSource('inner-semi', { type: 'geojson', data: inner });
    map.addLayer({ id: 'inner-fill', type: 'fill', source: 'inner-semi', paint: { 'fill-color': '#3b82f6', 'fill-opacity': 0.30 } });
    map.addLayer({ id: 'inner-border', type: 'line', source: 'inner-semi', paint: { 'line-color': '#3b82f6', 'line-width': 1 } });
  }, [mapLoaded, showCircles, radius]);

  return (
    <div className="w-full zindex-0">
      <div ref={containerRef} style={{ height: '650px', width: '100%' }} />
    </div>
  );
}
