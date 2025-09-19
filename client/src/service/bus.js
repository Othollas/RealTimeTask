const subscribers = {};

export const EventBus = {
    subscribe(event, callback) {
        if(!subscribers[event]) subscribers[event] = [];
        subscribers[event].push(callback);

        // retroune une fonction pour se désabonner 
        return () => {
            subscribers[event] = subscribers[event].filter(cb => cb !== callback)
        };
    },

    publish(event, data) {
        if(!subscribers[event]) return;
        subscribers[event].forEach(cb => cb(data));
       
    }
};