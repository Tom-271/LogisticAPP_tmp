'use client'

import {
  MapContainer,
  TileLayer,
  Popup,
  FeatureGroup,
  useMap,
} from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'

import 'leaflet-semicircle'
import 'leaflet/dist/leaflet.css'
import type { LatLngExpression, LatLngBoundsExpression, PathOptions } from 'leaflet'

// === Coordinate ===
const GENOVA: LatLngExpression = [44.4056, 8.9463]

// === Stili ===
const fillGreenOptions: PathOptions = { fillColor: 'green', color: 'green' }

// === Componente per il semicerchio (plugin leaflet-semicircle) ===
type SemiCircleProps = {
  center: [number, number]
  radius: number
  startAngle: number
  stopAngle: number
  options?: PathOptions
}



// c'è il campo radius che rappresenta il raggio del semicerchio e l'abbiamo gestito da database strapi nel campo content-manager
// in questo modo possiamo modificare il raggio senza dover toccare il codice, ma semplicemente aggiornando il valore nel database
// soprattutto in vista di eventuali modifiche future alla zona di copertura, che potrebbero richiedere un raggio diverso
// mi sembra utile dai

function SemiCircle({ center, radius, startAngle, stopAngle, options }: SemiCircleProps) {
  const map = useMap()

  useEffect(() => {
  // @ts-expect-error semiCircle dal plugin
  const layer = L.semiCircle(center, {
    radius,
    startAngle,
    stopAngle,
    color: '#3b82f6',
    fillColor: '#3b82f6',
    fillOpacity: 0.3,
    weight: 1,
  }).addTo(map)

  return () => {
    map.removeLayer(layer)
  }
}, [map, center, radius, startAngle, stopAngle])
  return null
}

// === Componente principale ===
export default function GeMap({ radius = 7500 }: { radius?: number }) {
  return (
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

      <SemiCircle
        key={radius}
        center={[44.3970, 8.9463]}
        radius={radius}
        startAngle={-78}
        stopAngle={-78 + 180}
        options={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.5 }}
      />

      <FeatureGroup pathOptions={fillGreenOptions}>
        <Popup>Popup in FeatureGroup</Popup>
      </FeatureGroup>
    </MapContainer>
  )
}