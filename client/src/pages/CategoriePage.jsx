/**
 * Composant CategoriePage
 * 
 * Rôle :
 *  Recupere les taches associé à l'id de la catégorie (via l'ID dans l'URL)
 *  e transmet à TaskList
 * 
 * Entrées (props) : 
 *  - tasks {Array} : liste des tâches associées à une catégorie (State géré par le parent)
 *  - setTasks {function} : setter qui permet de charge le state tasks
 *  - user {boolean} : indique si un utilisateur est connécté ou non
 * 
 * Sorties / Effets :
 *  - fetchTasks : récupère les tâches
 *      -> depuis la BDD si user connecté
 *      -> depuis localStorage sinon
 *  - Déclenche une erreur si la récupération échoue
 *  - Affiche TaskList et un bouton de retour
 */

import { Link, useParams } from "react-router-dom";
import TaskList from "../components/TaskList";
import { useState } from "react";


const CategoriePage = ({ tasks, setTasks, user }) => {


    const [error, setError] = useState(null);
    
    const params = useParams();

    // --------------------------
    // Récupération des tâches
    // --------------------------
    const fetchTasks = async () => {
        //     try {
        //         fetch(`http://localhost:3001/api/tasks/${params.id}`, {
        //             credentials: "include" // permet d'utiliser session/Cookie
        //         })
        //             .then((res) => {
        //                 if (!res.ok) throw new Error("Erreur de chargement");
        //                 return res.json();
        //             })
        //             .then((data) => {
        //                 if (!user) {
        //                     const taskStorage = JSON.parse(localStorage.getItem("defaultTasks"));
        //                     const data = taskStorage.filter(task => task.category_id === params.id);
        //                     setTasks(data)
        //                 }
        //                 if (user) {
        //                     setTasks(data.tasks)
        //                 }
        //             })
        //     } catch (error) {
        //         setError(error.message)
        //     }
        // }

        try {
            const res = await fetch(`http://localhost:3001/api/tasks/${params.id}`, {
                credentials: "include", // inclut cookies/session
            });

            if (!res.ok) throw new Error("Erreur de chargement");

            const data = await res.json();

            if (!user) {
                // Si non connecté → récupérer depuis localStorage
                const taskStorage = JSON.parse(localStorage.getItem("defaultTasks")) || [];
                const filtered = taskStorage.filter(
                    (task) => task.category_id === params.id
                );
                setTasks(filtered);
            } else {
                // Si connecté → récupérer depuis la BDD
                setTasks(data.tasks);
            }
        } catch (err) {
            setError(err.message);
        }
    };


    if (error) {
        throw new Error("erreur", error);
    }


    // --------------------------
    //  rendu JSX
    // --------------------------


    return (
        <div className="text-center my-5">
            <h1>Pages</h1>
            <TaskList tasks={tasks} fetchTasks={fetchTasks} user={user} />
            <Link to="/" className="btn btn-danger">Retour</Link>
        </div>
    );
}
export default CategoriePage;