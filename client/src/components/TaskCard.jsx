import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import CloseButton from 'react-bootstrap/CloseButton';
import { sendMessage } from '../service/webSocketService';
import Task from '../../../server/schemas/taskSchema';


function TaskCard({ task, fetchTasks, user }) {
  const [isModify, setIsModify] = useState(false);
  const [isCompleted, setIsCompleted] = useState(task.completed);
  const [title, setTtitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const created_at = task.created_at;
  const category_id = task.category_id;
  const taskId = task._id;


  const handleCompleted = () => {
    setIsCompleted(!isCompleted);
  }

  const closeButtonModify = () => {
    setIsModify(false);
    setTtitle(task.title);
    setDescription(task.description);
  }

  const handleDelete = async () => {
    try {

      if (!user) {

        const localTasks = JSON.parse(localStorage.getItem("defaultTasks"));
        const newTasks = localTasks.filter(task => task._id !== taskId);
        localStorage.setItem("defaultTasks", JSON.stringify(newTasks));
      }

      if (user) {
        const response = await fetch(`http://localhost:3001/api/tasks/${task._id}`, {
          method: 'DELETE',
          credentials: "include"
        });

        const data = await response.json();
        console.log(data)
        sendMessage({ type: "DELETED_TASK", payload: data.deletedTask });
        
        if (!response.ok) {
          throw new Error(data.message || `Erreur ${response.status}`);
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      fetchTasks();
    }
  }

  const handleModify = async (e) => {
    e.preventDefault();


    try {
      if (!user) {
        const localTask = JSON.parse(localStorage.getItem("defaultTasks"));
        const currentTask = localTask.filter(task => task._id === taskId);
        const newTask = {...currentTask[0], title:title, description:description, updated_at: new Date().toString()}
        const newLocalTask = [...localTask.filter(task => task._id !== newTask._id), newTask]
        localStorage.setItem("defaultTasks", JSON.stringify(newLocalTask));
      }

      if (user) {
        const response = await fetch(`http://localhost:3001/api/tasks/${task._id}`, {
          method: "PUT",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, created_at, category_id }),
          credentials: "include"
        })

        const data = await response.json();

        sendMessage({ type: "UPDATE_TASK", payload: data.updatedTask });

        if (!response.ok) {
          throw new Error("Erreur")
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsModify(false);
      fetchTasks();
    }
  }

  const inputModify = (title, description) => {


    return (
      <div className="d-flex justify-content-between align-items-center " style={{ height: '50px' }}>

        <div className='d-flex flex-column'>
          <label htmlFor="title">titre</label>
          <input type="text" name="title" id="title" value={title} onChange={(e) => setTtitle(e.target.value)} />
        </div>

        <div className='d-flex flex-column'>
          <label htmlFor="description">description</label>
          <input type="text" name="description" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <Button onClick={handleModify} variant="info">Envoyer</Button>
        <CloseButton onClick={closeButtonModify} />
      </div>
    )
  }



  return (
    <div className="border border-warning rounded-2 ps-2 w-75 mx-auto my-4">
      {isModify ? (
        <>
          {inputModify(title, description)}
        </>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center " style={{ height: '50px' }}>
            <p>{task.title}</p>
            <p>Tache crée le : {task.created_at}</p>
            <p>Modifer le : {task.updated_at}</p>
            <p>desciption : {task.description}</p>
            <Button onClick={() => { setIsModify(true) }} variant="info">Modifier</Button>
            {isCompleted && <Button onClick={handleDelete} variant="danger">Supprimer</Button>}
            <div onClick={handleCompleted} className={`h-100 ${isCompleted ? 'bg-success' : 'bg-danger'}`} style={{ width: '50px' }}></div>

          </div>
        </>
      )}

    </div>
  );
}

export default TaskCard;