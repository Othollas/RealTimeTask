/**
 * Service EventBus 
 * 
 * Rôle :
 *  - Permet de publiuer et de s'abonner à des événements globalement
 *  - Utile pour la communication entre composant sans props 
 * 
 * Méthodes :
 *  - Subscribe(event, ccallback) : S'abonne à un évenement et retourne une fonction de désabonnement
 *  - publish(event, data) : publie un événement et notifie tous les abonnés
 */


const subscribers = {}; // clé = nom d'événement, valeur = tableau de callbacks

export const EventBus = {
    /**
    * Abonne une fonction à un événement
    * @param {string} event - Nom de l'événement
    * @param {function} callback - Fonction à exécuter lors de la publication
    * @returns {function} - fonction pour se désabonner
    */
    subscribe(event, callback) {
        if (!subscribers[event]) subscribers[event] = [];
        subscribers[event].push(callback);

        // retroune une fonction pour se désabonner 
        return () => {
            subscribers[event] = subscribers[event].filter(cb => cb !== callback)
        };
    },

    /**
    * Publie un événement
     * @param {string} event - Nom de l'événement
     * @param {*} data - Données à transmettre aux abonnés
     */
    publish(event, data) {
        if (!subscribers[event]) return;
        subscribers[event].forEach(cb => cb(data));
    }
};