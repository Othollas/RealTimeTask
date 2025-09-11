let socket = null;
let isConnected = false;

export const connectSocket = () => {
  if (socket && isConnected) return socket; // déjà connecté

  socket = new WebSocket("ws://localhost:3001");

  socket.onopen = () => {
    console.log("Connecté au WS !");
    isConnected = true;
  };

  socket.onmessage = (e) => {
    console.log("Message du serveur :", e.data);
  };

  socket.onerror = (err) => {
    if (!err.target.url.includes("3001")) return; // ignore Vite HMR
    console.error("Erreur WS réelle :", err);
  };

  socket.onclose = () => {
    console.log("WS fermé");
    isConnected = false;
  };

  return socket;
};

export const sendMessage = (msg) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(msg));
  } else {
    console.warn("Impossible d'envoyer : WS non connecté");
  }
};
