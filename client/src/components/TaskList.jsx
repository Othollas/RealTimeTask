/**
 *  Composant TaskList 
 * 
 * Rôle :
 *  - Afiiche la liste des tâches d'une catégorie donnée 
 *  - Permet l'ajout d'une nouvelle tâche via le composant AddTask
 * 
 * Props :
 *  - tasks {Array} : tableau d'objets tâche
 *  - fetchTasks {Function} : fonction pour recharger les tâches aprés modification ou ajout
 *  - user {boolean} : indique si l'utilisateur est connecté
 * 
 * Effets :
 *  - Récupération des tâches lors du monage du composant (useEffect)
 *  - Rendu dynamique des cartes de tâches (TaskCard)
 *  - Passage de l"ID de la catégorie au composant AddTask
 * 
 */


import { useEffect } from "react";
import { useParams } from "react-router-dom";
import TaskCard from "./TaskCard";
import AddTask from "./CreateTask";

const TaskList = ({ tasks, fetchTasks, user }) => {


    // -------------------
    // Paramètres URL
    // -------------------
    // Récupère l'ID de la catégorie depuis les params de la route
    const params = useParams();
    const cat_id = params.id;


    // -------------------
    // Récupération initiale des tâches
    // -------------------
    useEffect(() => {
        fetchTasks(); // Recharge la liste des tâches à l’ouverture du composant
    }, [])

    // -------------------
    // Rendu JSX
    // -------------------

    return (
        <div className="container my-5 mx-auto">
            <p>l'id de la categorie est : {cat_id}</p>
            <div>
                {tasks.map(task =>
                    <TaskCard key={task._id} task={task} fetchTasks={fetchTasks} user={user} />)}
            </div>
            <AddTask id_category={cat_id} fetchTasks={fetchTasks} user={user} />
        </div>
    )
}

export default TaskList;