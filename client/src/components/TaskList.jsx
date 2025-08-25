
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import TaskCard from "./TaskCard";
import AddTask from "./CreateTask";

const TaskList = ({ tasks, fetchTasks }) => {


    // Récupération de la 
    const params = useParams();
    const cat_id = params.id;

    useEffect(() => {
        fetchTasks();
    }, [])



    return (
        <div className="container my-5 mx-auto">
            <p>l'id de la categorie est : {cat_id}</p>
            <div>
                {tasks.map(task =>
                    <TaskCard key={task._id} task={task} fetchTasks={fetchTasks} />)}
            </div>
            <AddTask id_category={cat_id} fetchTasks={fetchTasks} />
        </div>
    )
}

export default TaskList;