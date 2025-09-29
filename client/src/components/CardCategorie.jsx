/**
 * Composant CardCategorie
 * 
 * Rôle :
 * Gère l'affichage de la categorie / sert de template / Gère la modification et la suppression des categories selon si l'user est connecté ou non
 * 
 * Entrée :
 * - categorie, fetchcategorie (state) et user (boolean)
 * 
 * Sorties / Effets
 * -Affiche la CARD categorie, et affiche les bouton necessaire dynamiquement
 * - Supprime la categorie quand demandé
 */

/**
 * 
 * Composant CardCategorie
 * 
 * Rôle :
 * Affiche une carte représentant une catégorie et permet sa modification ou suppression selon si l'utilisateur est connecté, sert de template pour chaque catégorie.
 *  
 * 
 * Entrées (props) :
 *  - catégorie object {_id, name, description, created_at } representant la categorie
 *  - fetchCategiorie : fonction pour recharger la liste des catégories aprés modification/suppression
 *  - user : boolean indiquand si l'utilisateur est connecté
 * 
 * Sorties / Effets :
 *  - Affiche dynamiquement les bouton Modifier/ Supprimer selon l'état
 *  - Met à jour le nombre de tâches associées à la catégorie
 *  - Supprime ou modifie la catégorie dans la BDD ou localStorage
 *  - Envoie des messages via webSocket pour notoifier d'autre client
 * 
 * TODO / FIXME : 
 *  - Ajouter gestion d'erreurs et retour utilisateur plus clair
 *  - Retirer les console.log en production
 *  - Ajouter validation des champs avant modification
 *  - Modifier la fonction handleModify pour inclure l'user et ne pas faire d'appel API pour rien
 */



import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import img from "/vite.svg?url"
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { sendMessage } from '../service/webSocketService';



const CardCategorie = ({ categorie, fetchCategorie, user }) => {
    // State locaux : nombre de tâches, mode modification, nom et description modifiables
    const [count, setCount] = useState(0);
    const [isModify, setIsModify] = useState(false);
    const [name, setName] = useState(categorie.name);
    const [description, setDescription] = useState(categorie.description || "");
    const created_at = categorie.created_at;


    //-----------------------------
    // Hook : récupération du nombre de tâches
    //-----------------------------

    // Recuperation du nombre de tache dans la categorie au montage
    useEffect(() => {
        getTaskCount(categorie._id)
    }, [])


    /**
     * 
     * @param {String} id - ID de la catégorie 
     * 
     * BRANCHES :
     *  - utilisateur non connecté -> récupère depuis localStorage
     *  - utilisateur connecté -> Récuper depuis L'API
     */
    const getTaskCount = async (id) => {

        try {
            if (!user) {
                const localTasks = JSON.parse(localStorage.getItem("defaultTasks"));
                const taskMatched = localTasks.filter(task => id === task.category_id)
                setCount(taskMatched.length);
            }
            if (user) {
                const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
                    credentials: "include" // inclut les cookies/session
                });
                const data = await response.json();
                const { tasks } = await data;

                setCount(tasks.length)
            }

        } catch (error) {
            console.error(error)
        } finally {
            fetchCategorie(); // Rafraîchit la liste parent
        };
    }


    //-----------------------------
    // Fonction de suppresion de catégorie
    //----------------------------- 
    const handleDelete = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3001/api/categories/${categorie._id}`, {
                method: "DELETE",
                credentials: "include" // inlcut les cookies / session
            });

            const data = await response.json();

            if (data.source === "db") {
                console.log('Réponse serveur:', data);
                if (!response.ok) {
                    throw new Error(data.message || `Erreur ${response.status}`);
                }
                sendMessage({ type: "DELETED_CATEGORY", payload: data })
                console.log('✅ Supprimé avec succès');
            } else if (data.source === "Guest") {
                 // suppression côté client (localStorage)
                const storageCategorie = JSON.parse(localStorage.getItem("defaultCategorie"));
                const newStorage = storageCategorie.filter(element => {
                    return element._id !== categorie._id;
                });

                localStorage.setItem("defaultCategorie", JSON.stringify(newStorage));
            }

        } catch (err) {
            console.error('Erreur:', err);
        } finally {
            fetchCategorie(); // rafraîchit la liste parent
        }
    };


   // ---------------------------
    // Fonction de modification de catégorie
    // ---------------------------
    const handleModify = async (e) => {
        e.preventDefault();

        try {
            if (!user) {
                // modification côté localStorage
                const oldStorageCategorie = JSON.parse(localStorage.getItem("defaultCategorie"));
                const currentCategorie = oldStorageCategorie.filter(cat => cat._id === categorie._id);
                const categoryModified = { ...currentCategorie[0], name: name, description: description, updated_at: Date.now() };
                const newCategory = [...oldStorageCategorie.filter(cat => cat._id !== categorie._id), categoryModified];
                localStorage.setItem("defaultCategorie", JSON.stringify(newCategory));
            }

            if (user) {
                const response = await fetch(`http://localhost:3001/api/categories/${categorie._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, description, created_at }),
                    credentials: "include"
                })
                const data = await response.json();
                console.log('Réponse serveur:', data); // TODO: retirer console.log
                if (!response.ok) {
                    throw new Error("Erreur") 
                }

                sendMessage({
                    type: "UPDATE_CATEGORY",
                    payload: data,
                    sessionId: "abc123"
                })
            }
        } catch (err) {
            console.error("Erreur handleModify:", err) // TODO: retour utilisateur
        } finally {
            setIsModify(false); 
            fetchCategorie();
        };
    }


    // ---------------------------
    // JSX : affichage de la carte
    // ---------------------------

    return (
        <Card className="shadow" style={{ width: '15rem' }}>
            <Link to={`/categorie/${categorie._id}`}><Card.Img className='mt-2' variant="top" src={img} /></Link>

            <Card.Body className='text-center' >

                <Link to={`/categorie/${categorie._id}`}>
                    <Card.Title>{categorie.name}</Card.Title>

                </Link>

                <Card.Text>{categorie.description}</Card.Text>
                <Card.Text>{count === 1 || count === 0 ? `Vous avez ${count} tache` : `Vous avez ${count} taches`}</Card.Text>
                <div className='text-center'>
                    {!isModify ? (
                        <>
                            <Button as='a' className='m-1' variant="primary" action={null} onClick={() => setIsModify(true)}>Modifier
                            </Button>
                        </>

                    ) : (
                        <form onSubmit={handleModify}>
                            <div>
                                <label>Nom : </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label>Description : </label>
                                <input
                                    type="text"
                                    className='m-0 p-0'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <Button className='m-2' type="submit" variant='primary'>
                                Envoyer
                            </Button>
                            <Button className='m-2 ' type="submit" variant='close' onClick={() => setIsModify(false)}></Button>
                        </form>
                    )}
                </div>
                {!isModify ? (
                    <Button as='a' className='m-1' variant="danger" action={null} onClick={handleDelete} >suppr</Button>
                ) : (
                    null
                )}

            </Card.Body>
        </Card>
    )

}

export default CardCategorie;