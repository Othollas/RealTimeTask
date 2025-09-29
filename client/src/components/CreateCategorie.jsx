/**
 * 
 *  Composant AddCategorie (CreateCategorie)
 * 
 * Rôle :
 * Premet de crée une nouvelle categorie.
 *  - Si l'utilisateur est connecté  : sctocke la catégorie dans la BDD et envoie un message websocket 
 *  - Si l'utilisateur n'est pas connecté : stocke la catégorie dans le localStorage 
 * 
 * Entrées (props) : 
 *  - fectchCategorie: fonction pour recharger la liste des catégories aprés création 
 *  - user : boolean, indique si l'utilisateur est connecté 
 * 
 * Sorties // Effets :
 *  - Met à jour la liste des catégories via fetchCategorie
 *  - Envoie des messages WebSocket si user connecté 
 *  - Affiche le toast de confirmation
 * 
 * TODO / FIXME :
 *  - Ajouter validation des champs avant creation (ex: champ name vide)
 *  - Gestion d'erreurs utilisateur plus visible (actuellement console.error)
 *  - Vérifier le type/format des champs avant envoi à la BDD
 * 
 * 
 */


import { useState } from "react";
import { sendMessage } from "../service/webSocketService";
import generateId from "../function";
import { toastService } from "../service/toastService";

const AddCategory = ({ fetchCategorie, user }) => {
    // State locaux pour crontrôler le formulaire
    const [isAdding, setIsAdding] = useState(false); // mode ajout actif/inactif
    const [name, setName] = useState(''); // nom de la catégorie
    const [description, setDescription] = useState(''); // description facultative
    const [isLoading, setIsLoading] = useState(false); // indique l'envoi en cours

    // Réinitialise le formulaire et rafraîchit la liste des catégories
    const resetAddinginput = () => {
        fetchCategorie();
        setName('');
        setDescription('');
        setIsAdding(false);
    }


    /**
     * Fontion submit du formulaire 
     *  - Enregistre la catégorie dans la BDD si conecté
     *  - Sinon l'enregistre dans un localStorage
     *  - Envoie un message WebSocket aux autres clients si user connecté
     *  
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!user) {
                // Création localStorage pour utilisateurs non connectés
                const newDescription = description === "" ? null : description;
                let newCategorie = {
                    _id: generateId(),
                    name: name, description:
                        newDescription, owner: null,
                    created_at: Date.now(),
                    updated_at: Date.now()
                }
                const localCategorie = JSON.parse(localStorage.getItem("defaultCategorie"));
                const newLocalCategorie = [...localCategorie, newCategorie];
                localStorage.setItem("defaultCategorie", JSON.stringify(newLocalCategorie));
                resetAddinginput();
            }

            if (user) {
                // Création côté serveur pour les utilisateurs connectés 
                const response = await fetch('http://localhost:3001/api/categories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, description }),
                    credentials: "include",
                });
                const data = await response.json()


                if (response.ok) {
                    // envoie le message WebSocket aux autres clients
                    sendMessage({ type: "CREATE_CATEGORY", payload: data.result })
                    toastService.show(`Création de la catégorie`, 'success')
                    resetAddinginput();
                } else {
                    throw new Error("Echec de L'envoi")
                }
            }
        } catch (err) {
            console.error('Erreur:', err);
        } finally {
            fetchCategorie();
            setIsLoading(false)
        }
    };



    // Réinitialise les champs du formulaire sans soumettre
    const handleReset = () => {
        setName('');
        setDescription('');
        setIsAdding(false);
    }


    // ---------------------------
    // JSX : affichage du bouton + et du formulaire
    // ---------------------------
    return (
        <div className="position-absolute">
            {!isAdding ? (

                <button
                    onClick={() => setIsAdding(true)}
                    className="btn btn-warning position-fixed bottom-0 start-0 m-4 shadow">
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
                                value={name}
                                className="form-control-plaintext rounded-pill shadow "
                                htmlFor="name"
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label id="name">Nom : </label>
                        </div>

                        <div className="form-floating me-5">

                            <input
                                type="text"
                                value={description}
                                htmlFor="description"
                                className="form-control-plaintext p-2 rounded-pill shadow"
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <label id="description">Description : </label>
                        </div>
                        <button 
                        className="btn btn-outline-success" 
                        type="submit" 
                        disabled={isLoading}
                        >
                            {isLoading ? 'Envoi en cours... ' : 'Envoyer'}
                        </button>

                        <button 
                        className="btn-close ms-4 p-4" 
                        type="submit" 
                        onClick={handleReset}
                        >

                        </button>
                    </form>
                </>

            )}
        </div>
    );
};

export default AddCategory;