import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Importar las imágenes de los íconos de Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIconShadow from 'leaflet/dist/images/marker-shadow.png';

// Configurar el ícono predeterminado para los marcadores
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerIconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapView = () => {
  const [stations, setStations] = useState([]);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Usar axios para obtener las estaciones
        const stationResponse = await axios.get('https://tarea-2.2024-1.tallerdeintegracion.cl/api/metro/stations');
        setStations(stationResponse.data);

        // Usar axios para obtener las líneas
        const lineResponse = await axios.get('https://tarea-2.2024-1.tallerdeintegracion.cl/api/metro/lines');
        setLines(lineResponse.data);
      } catch (error) {
        console.error("Error fetching data with axios:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <MapContainer center={[-33.4489, -70.6693]} zoom={13} style={{ height: '500px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {stations.map(station => (
        <Marker
          key={`${station.station_id}-${station.line_id}`}
          position={[station.position.lat, station.position.long]}
          icon={defaultIcon}
        >
          <Popup>{`ID: ${station.station_id}, Name: ${station.name}, Line: ${station.line_id}`}</Popup>
        </Marker>
      ))}
      {lines.map(line => (
        <Polyline
          key={line.line_id}
          positions={line.station_ids.map(stationId => {
            const station = stations.find(s => s.station_id === stationId && s.line_id === line.line_id);
            return station ? [station.position.lat, station.position.long] : null;
          }).filter(p => p !== null)}
          color={line.color}
        />
      ))}
    </MapContainer>
  );
};

export default MapView;
