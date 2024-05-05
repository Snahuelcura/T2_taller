import React, { useState, useEffect } from 'react';
import TravelInfoTable from './TravelInfoTable';
import MapView from './TrainsMap';
import Chat from './Chat';
import { initWebSocket } from './websocketService';

function App() {
  const [websocket, setWebsocket] = useState(null);

  useEffect(() => {
    const handleMessage = (message) => {
      console.log("Received data:", message);
      // Aquí procesarías el mensaje recibido
    };

    const socket = initWebSocket(handleMessage);
    setWebsocket(socket);

    // Manejo de cierre de conexión al cerrar o recargar la página
    const handleUnload = () => {
      console.log("Closing WebSocket due to page unload...");
      socket.close();
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      socket.close();  // Asegurarse de cerrar el socket cuando el componente se desmonta
    };
  }, []);

  return (
    <div>
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
      {websocket && (
        <>
          <div style={{ width: '50%', marginRight: '10px' }}>
            <MapView websocket={websocket} />
          </div>
          <div style={{ width: '40%', marginLeft: '10px' }}>
            <Chat websocket={websocket} />
          </div>
        </>
      )}
      
    </div>
    
    <TravelInfoTable websocket={websocket} />

    </div>
  );
}

export default App;
