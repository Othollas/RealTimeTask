// Définition d'une classe afin de gerer les toast

class ToastService {
    constructor() {
        this.listeners = []; // Tableau ou seront stocké les fonctions d'ecoute (listener)
    }

    //Methode permetant d'afficher un nouveau toast
    show(message, type = 'success') {
        const toast = {
            id: Date.now(), // ID unique
            message, // Message à afficher 
            type  // type (succes, danger, warning, info)
        };
        this.notifyListeners(toast); // Avec cette fontion on notifie qu'un toast est dispo
    }

    // Methode d'abonnement au nouveaux toast
    subscribe(listener) {
        this.listeners.push(listener); // ajoute le listener au tableau 

        // on retourne une fonction de desabonnement (cleanUp)
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener); // fonction qui retire le listener quand il est appelé
        }
    }

    // Méthode pour notifier tous les listeners
    notifyListeners(toast) {
        
        this.listeners.forEach(listener => {
            listener(toast) // pour chaque listener on l'appelle dans un nouveau toast
        })
    }
}

// Creation d'une seule instance partagée par toute l'application 
export const toastService = new ToastService()