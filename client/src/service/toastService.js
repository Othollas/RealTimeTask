// Définition d'une classe afin de gerer les toast

import generateId from "../function";

/**
 * ToastService
 * 
 * rôle: 
 *  - Gérer les notifications "toast" dans l'application
 *  - Permettre aux composants de s'abonner aux nouveaux toasts 
 *  - Fournir un mécanisme simple pour créer, diffuser et nettoyer les toasts
 * 
 * Concept clé : 
 *  - Chaque toast est un objet { id, mesage, type }
 *  - Les composants s'abonnent via suscribe(listener)
 *  - Lorsqu'un toast est cré via show(), notifyListener() informe tous les abonnées
 * 
 */
class ToastService {
    constructor() {
        this.listeners = []; // Tableau ou seront stocké les fonctions d'ecoute (listener)
    }


    //Methode permetant d'afficher un nouveau toast
    /**
     * 
     * @param {string} message  - Message à afficher
     * @param {string} type - Type du toast : 'success', 'danger',  'warning', 'info' 
     * 
     * exemple d'utilisation : 
     *  toastService.show("Action Réussie"); // toast vert par défaut
     *  toastService.show("Erreur critique", "danger"); // toast rouge  
     */
    show(message, type = 'success') {
        const toast = {
            id: generateId(), // ID unique basé sur mon generateur d'id qui utilise l'objet crypto pour identifier chaque toast
            message, // Message à afficher dnas le toast
            type  // type (succes, danger, warning, info)
        };
        this.notifyListeners(toast); // Avec cette fonction on notifie qu'un toast est dispo
    }


    /**
     * Permet à un composant de s'abonner aux toast
     * 
     * @param {function} listener - Fonction qui sera appelée à chaque nouveau toast 
     * @returns {function} - Fonction de désabonnement pour retirer ce listener
     * 
     * exemple :
     *    const unsubscribe = toastService.subscrive(toast => console.log(toast.message))
     *    unsubscribe(); // supprime le listener 
     */
    subscribe(listener) {
        this.listeners.push(listener); // ajoute le listener au tableau 

        // on retourne une fonction de desabonnement (cleanUp)
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener); // fonction qui retire le listener quand il est appelé
        }
    }

    /**
     * Méthode pour notifier tous les listeners
     * 
     * @param {object} toast - Object {id, message, type} à envoyer aux listeners
     * 
     * Usage : utilisé en intern par show()
     */

    notifyListeners(toast) {

        this.listeners.forEach(listener => {
            listener(toast) // pour chaque listener on l'appelle dans un nouveau toast
        })
    }
}

// Creation d'une seule instance partagée par toute l'application 
export const toastService = new ToastService();