import { Link, useParams } from "react-router-dom";
import TaskList from "../components/TaskList";
import { useState } from "react";




const CategoriePage = () => {

    const params = useParams();


const [tasks, setTasks] = useState([]);
const [error, setError] = useState(null);

    const fetchTasks = async () => {
        fetch(`http://localhost:3001/api/tasks/${params.id}`, {
            credentials: "include"
        })
        .then((res) => {
            if (!res.ok) throw new Error("Erreur de chargement");
            return res.json();
        })
            .then((data) => {
                console.log(data.source)
                setTasks(data)
            })
            .catch((err) => setError(err.message))
    }

    if (error) {
        throw new Error("erreur", error);
    }

    return (
        <div className="text-center my-5">
            <h1>Pages</h1>
            <TaskList  tasks={tasks} fetchTasks={fetchTasks} />
            <Link to="/" className="btn btn-danger">Retour</Link>
        </div>
    );
}
export default CategoriePage;