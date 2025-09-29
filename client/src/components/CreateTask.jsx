/**
 * Composant AddTask (CreateTask)
 * 
 * Rôle:
 * Permet de créer une nouvelle tache dans sa catégorie selon l'id de la catégorie
 *  - Si l'utilisateur est connecté : Ajout dans la BDD 
 *  - Sinon elle est ajoutée dans le localStorage 
 * 
 * 
 * Entrées (props) :
 * id_category : l'identifiant de la catégorie dans laquelle sera crée la tâche
 * fetchTasks : fonction pour recharger les tâches aprés la creation
 * user : boolean pour savoir si l'utilisateur est connecté
 *  
 * 
 * Sorties // Effets :
 * 
 *  - Met à jour la liste des tâches via fetchTasks
 *  - Envoie des messages WebSocket si user connecté 
 *  - Affiche un toast de confirmation
 * 
 * TODOS / FIXME :
 *  - Ajouter gestions d'erreurs et retour utilisateur plus clair
 *  - Retirer les console.log en production 
 *  - Ajouter la validation des champs avant envoie
 *  
 */


import { useState } from "react";
import { sendMessage } from "../service/webSocketService";
import generateId from "../function";


const AddTask = ({ fetchTasks, id_category, user }) => {
    // State locaux pour contrôler le formulaire
    const [isAdding, setIsAdding] = useState(false); // mode ajout actif/inactif
    const [title, setTitle] = useState(''); // nom du titre de la tâche
    const [isLoading, setIsLoading] = useState(false); // indique si l'envoit est en cours 
    const [description, setDescription] = useState(''); // description de la tâche



    /**
     * Fonction submit du formulaire 
     *  - Enregistre la tâche dans la BDD si connecté 
     *  - Sinon l'enregistrement dans un webSocket
     *  - Envoie un message WebSocket aux autres clients si user connecté 
     *
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const newTask = {
            _id: generateId(),
            title: title,
            description: description != '' ? description : null,
            category_id: id_category,
            created_at: new Date().toString(),
            updated_at: new Date().toString(),
            completed: false,
            recovery_time: null,
            point: null
        }

        try {

            if (!user) {
                // Creation localStorage pour utilisateur non connecté 
                const localTasks = JSON.parse(localStorage.getItem("defaultTasks"));
                const newLocalTasks = [...localTasks, newTask];
                localStorage.setItem("defaultTasks", JSON.stringify(newLocalTasks));
                handleReset(); // reset le formulaire aprés validation
            }

            if (user) {
                // Creation côté serveur pour les utilisateurs connectés
                const response = await fetch('http://localhost:3001/api/tasks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, description, id_category }),
                    credentials: "include" // Pemret d'accéder à session/cookies
                });

                const data = await response.json();

                console.log(data.result.title); // A retirer en prod 

                if (!response.ok) throw new Error("Echec de L'envoi");
                    sendMessage({ type: "CREATE_TASK", payload: data.result });
                    handleReset(); //Reinitialiser les champs et revenir au bouton initial
            }
        } catch (err) {
            console.error('Erreur:', err);
        } finally {
            fetchTasks();
            setIsLoading(false);
        }
    };




    // Réinitialise le formulaire
    const handleReset = () => {
        setTitle('');
        setDescription('');
        setIsAdding(false);
    }

    // ---------------------------
    // JSX : affichage de la carte
    // ---------------------------
    return (
        <div className="position-absolute">
            {!isAdding ? (

                <button
                    onClick={() => setIsAdding(true)}
                    className="btn 
                    btn-warning 
                    position-fixed 
                    bottom-0 
                    start-0 
                    m-4 
                    shadow"
                >
                    <span>+</span>
                </button>
            ) : (

                <>
                    <form
                        onSubmit={handleSubmit}
                        className="position-fixed 
                        bottom-0 
                        start-0  
                        text-start 
                        form m-3 
                        border 
                        text-bg-light 
                        p-3 
                        shadow 
                        d-flex 
                        align-items-center
                        rounded-pill"
                    >
                        <div className="form-floating me-5">
                            <input
                                type="text"
                                value={title}
                                id="title"
                                className="form-control-plaintext rounded-pill shadow"
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <label htmlFor="title">Titre : </label>
                        </div>

                        <div className="form-floating me-5">

                            <input
                                type="text"
                                value={description}
                                id="description"
                                className="form-control-plaintext p-2 rounded-pill shadow"
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <label htmlFor="description">Description : </label>
                        </div>
                        <button className="btn btn-outline-success" type="submit" disabled={isLoading}>
                            {isLoading ? 'Envoi en cours... ' : 'Envoyer'}
                        </button>
                        <button className="btn-close ms-4 p-4" type="button" onClick={handleReset}>

                        </button>
                    </form>
                </>

            )}
        </div>
    );
};



export default AddTask;