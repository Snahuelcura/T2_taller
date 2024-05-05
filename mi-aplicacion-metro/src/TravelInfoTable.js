import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importar axios

const TravelInfoTable = ({ websocket }) => {
  const [stations, setStations] = useState([]);
  const [trains, setTrains] = useState([]);

  const fetchData = async () => {
    try {
      const stationsResponse = await axios.get('https://tarea-2.2024-1.tallerdeintegracion.cl/api/metro/stations');
      setStations(stationsResponse.data);

      const trainsResponse = await axios.get('https://tarea-2.2024-1.tallerdeintegracion.cl/api/metro/trains');
      setTrains(trainsResponse.data.map(train => ({
        ...train,
        current_station_id: '-'  // Valor inicial, significa 'no en estación'
      })));
    } catch (error) {
      console.error("Error fetching data with axios:", error);
    }
  };

  useEffect(() => {
    fetchData();

    const handleMessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received data:", message);

      if (message.type === 'arrival' || message.type === 'departure') {
        setTrains(prevTrains => prevTrains.map(train => {
          if (train.train_id === message.data.train_id) {
            return { ...train, current_station_id: message.type === 'arrival' ? message.data.station_id : '-' };
          }
          return train;
        }));
      }
    };

    websocket.addEventListener('message', handleMessage);

    return () => {
      websocket.removeEventListener('message', handleMessage);
    };
  }, [websocket]);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <div style={{ width: '50%' }}>
        <h2>Información de Estaciones</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>ID</th>
              <th>Línea</th>
            </tr>
          </thead>
          <tbody>
            {stations.map(station => (
              <tr key={`${station.station_id}-${station.line_id}`}>
                <td>{station.name}</td>
                <td>{station.station_id}</td>
                <td>{station.line_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ width: '50%' }}>
        <h2>Información de Trenes</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Estación de Origen</th>
              <th>Estación de Destino</th>
              <th>Estación Actual</th>
            </tr>
          </thead>
          <tbody>
            {trains.map(train => (
              <tr key={train.train_id}>
                <td>{train.train_id}</td>
                <td>{train.driver_name}</td>
                <td>{train.origin_station_id}</td>
                <td>{train.destination_station_id}</td>
                <td>{train.current_station_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TravelInfoTable;
