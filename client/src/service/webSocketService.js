let socket = null;

export const connectSocket = ()=>{
    socket = new WebSocket(`ws://localhost:8080`);

    socket.onopen = () => console.log("Connecté au WebSocket");
    socket.onmessage = (e) => console.log("Message:", e.data);
};

export const sendMessage = (msg) =>{
    if (socket && socket.readuState === WebSocket.OPEN) {
        socket.send(JSON.stringify(msg));
    };
};