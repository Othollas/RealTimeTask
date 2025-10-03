/**
 * WebSocket Service
 * 
 * Rôle :
 *  - Gérer une connexion WebSocket unique avec le serveur (ws://localhost:3001)
 *  - Fournir un moyen de se connecter, d'envoyer des messages et de recevoir des messages
 *  - Centraliser la gestion des événements WebSocket (conexion ouverte, message reçu, erreur, fermeture)
 * 
 * Fonctionnalités principales :
 ** 1. connectSocket()
 *    - Crée une connexion WebSocket si aucune connexion active n'existe
 *    - Évite de recréer plusieurs connexions simultanées
 *    - Définit des callbacks pour :
 *        - onopen : marquer la connexion comme active
 *        - onmessage : afficher les messages reçus (possibilité d'ajouter propagation via EventBus)
 *        - onerror : afficher les erreurs réelles (ignore les erreurs Vite HMR)
 *        - onclose : marquer la connexion comme fermée
 *    - Retourne l'instance WebSocket active
 * 
 * 2. sendMessage(msg)
 *    - Envoie un objet `msg` (converti en JSON) via la WebSocket si elle est ouverte
 *    - Sinon, affiche un avertissement dans la console
 * 
 * Comportement mémoire :
 *  - Une seule instance de WebSocket est stockée dans `socket`
 *  - L'état de la connexion est suivi via `isConnected`
 *  - Les callbacks (listeners) sont conservés dans la mémoire tant que la connexion est active
 *  - Permet à d'autres parties de l'application de communiquer avec le serveur en utilisant cette instance unique
 * 
 * Usage typique :
 *  const ws = connectSocket(); // récupère la WebSocket active
 *  sendMessage({ type: "CREATE_TASK", payload: task }); // envoie un message au serveur
 */


// variable globale pour stocker l'instance WebSocket
let socket = null;

// Indicateur de connexion active
let isConnected = false;


/**
 * Fonction connectSocket
 * 
 * Rôle :
 *  - Crée une connecion WebSocket si elle n'existe pas ou si elle est fermé
 *  - Gère les événements WebSocket (open, message, error, close)
 * 
 * Retour : 
 *  - L'instance WebSocket est activé
 * 
 */
export const connectSocket = () => {

  // Si socket déjà créé et connecté, on retourne l'instance existante
  if (socket && isConnected) return socket; // déjà connecté

   // Création d'une nouvelle instance WebSocket vers le serveur WS
  socket = new WebSocket("ws://localhost:3001");

  // ---------------------------
  // Gestion des événements WebSocket
  // ---------------------------

  // Quand la connexion est ouverte
  socket.onopen = () => {
    console.log("Connecté au WS !");
    isConnected = true;
  };

  // Quand un message est reçu du serveur
  socket.onmessage = (e) => {
    console.log("Message du serveur :", e.data);
    // Ici on pourrait ajouter un EventBus.publish ou callback pour propager le message
  };

    // Quand une erreur survient sur la connexion
  socket.onerror = (err) => {
    if (!err.target.url.includes("3001")) return; // Ignore les erreurs liées au hot reload de Vite
    console.error("Erreur WS réelle :", err);
  };

   // Quand la connexion est fermée
  socket.onclose = () => {
    console.log("WS fermé");
    isConnected = false; // Marquer la connexion comme inactive
  };

  // Retourner l'instance WebSocket
  return socket;
};

/**
 * Fonction sendMessage
 * 
 * Rôle :
 *  - Envoie un message via la WebSocket active
 * 
 * Entrée :
 *  - msg : objet à envoyer, sera converti en JSON
 * 
 * Comportement :
 *  - Si WS est ouvert, envoie le message
 *  - Sinon, affiche un avertissement
 */
export const sendMessage = (msg) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(msg)); // convertir l'objet en chaîne JSON et envoyer
  } else {
    console.warn("Impossible d'envoyer : WS non connecté");
  }
};
