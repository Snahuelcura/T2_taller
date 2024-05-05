export const initWebSocket = (handleMessage) => {
  let socket;
  let reconnectInterval = 5000;  // Intervalo de reconexión en milisegundos
  let shouldReconnect = true;
  let isConnecting = false;

  const connectWebSocket = () => {
    if (isConnecting || (socket && socket.readyState === WebSocket.OPEN)) {
      return; // Evitar nuevas conexiones si ya hay una en proceso o abierta
    }

    isConnecting = true; // Marcar que la conexión está en proceso
    socket = new WebSocket('wss://tarea-2.2024-1.tallerdeintegracion.cl/connect');

    socket.onopen = () => {
      console.log("WebSocket connection established");
      socket.send(JSON.stringify({ type: 'JOIN', payload: { id: '19642539', username: 'Tuckita' } }));
      isConnecting = false; // Resetear el estado de conexión en proceso
    };

    socket.onmessage = (event) => {
      console.log("Mensaje recibido:", event.data);
      const message = JSON.parse(event.data);
      handleMessage(message);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error observed:", error);
      isConnecting = false;
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
      if (shouldReconnect && !event.wasClean && event.code !== 1000) {
        setTimeout(connectWebSocket, reconnectInterval);
      }
      isConnecting = false;
    };
  };

  connectWebSocket();
  return socket;
};
