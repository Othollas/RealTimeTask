
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CategoriesHome from './pages/CategoriesHome';
import CategoriePage from './pages/CategoriePage';
import NotFound from './pages/NotFound';
import Login from './components/Login';
import Register from './components/Register';
import { useEffect, useState } from 'react';
import { connectSocket } from './service/webSocketService';
import { EventBus } from './service/bus';
import { toastService } from './service/toastService';
import GlobalToast from './components/GlobalToast';
import MonCompte from './pages/MonCompte';



function App() {

  const [user, setUser] = useState(false) //user = {info, token}
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
 

  useEffect(() => {
    fetch("http://localhost:3001/api/auth/me", {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          // console.log("user log", data.user);
          setUser(true);
          toastService.show('Connecté avec succés !', 'success');
        } else {
          console.log("user pas connecté")
        }
      })
      .catch(()=>setUser(false))
      .finally(()=> setLoading(false))

  }, [])

// useEffect pour confirmer l'authentification du l'user
  useEffect(() => {

    if (user) {
      const ws = connectSocket();
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          // console.log("[App] Message WS reçu :", msg);
          EventBus.publish(msg.type, msg.payload);
          // console.log(msg.type, msg.payload);
        } catch (error) {
          console.error("Message WS invalide", error.data);
        }
      }
      return () => ws.close()
    }
  }, [user])

// Souscription à l'eventBus pour la creation de CATEGORIE
  useEffect(() => {

    // Abonnement création 
    const unsubCreate = EventBus.subscribe("CREATE_CATEGORY", (newCat) => {
      // console.log("[CategoriesHome] Catégorie reçue via EventBus :", newCat);
      setCategories(prev => [...prev, newCat]);
      console.log("Nouvelle catégorie reçue :", newCat);
      toastService.show('Nouvelle Categorie crée', 'success');
      // alert("Nouvelle catégorie reçue : " + newCat.name);
    });

    return () => unsubCreate();
  }, [])

// Souscription à l'eventBus pour la creation de TASK
  useEffect(() => {

    // Abonnement création 
    const unsubCreate = EventBus.subscribe("CREATE_TASK", (newTask) => {
      // console.log("[TaskList] Tâche reçue via EventBus :", newTask);
      setTasks(prev => [...prev, newTask]);
      console.log("Nouvelle catégorie reçue :", newTask.title);
      toastService.show(`Nouvelle Tâche crée : ${newTask.title}`, 'success');
      // alert("Nouvelle tâche reçue : " + newTask.name);
    });

    return () => unsubCreate();
  }, [])

// Souscription à l'eventBus pour la suppression de CATEGORIE
  useEffect(() => {
    const unsubDeleted = EventBus.subscribe("DELETED_CATEGORY", (deletedCat) => {
      console.log("[CategoriesHome] Catégorie reçue via Eventbus :", deletedCat)
      setCategories(prev => prev.filter(category => category._id !== deletedCat.deletedCategory._id));
      toastService.show('Catégorie supprimé', 'danger')
    });

    return () => unsubDeleted();
  }, [])

// Souscription à l'eventBus pour la modification de CATEGORIE
  useEffect(() => {
    const unsubModify = EventBus.subscribe("UPDATE_CATEGORY", (modifiedCat) => {
      console.log("[CategoriesHome] Caégorie reçu via Eventbus :", modifiedCat);
      setCategories(prev => prev.map(category => category._id === modifiedCat.updatedCategory._id ? modifiedCat.updatedCategory : category));
      toastService.show(`categorie "${modifiedCat.oldName}" modifié en "${modifiedCat.updatedCategory.name}"`, 'info')
    });

    return () => unsubModify();
  }, [])

// Souscription à li'eventBus pour la modification de TASK
  useEffect(() => {
    const unsubModify = EventBus.subscribe("UPDATE_TASK", (modifiedTask) => {
      console.log("[TaskHome] Tâche reçu via Eventbus :", modifiedTask);
      setTasks(prev => prev.map(task => task._id === modifiedTask._id ? modifiedTask : task));
      toastService.show('Tâche modifé', 'info')
    });

    return () => unsubModify();
  }, [])

// Souscription à l'eventBus pour la suppression de TASK
  useEffect(() => {
    const unsubDeleted = EventBus.subscribe("DELETED_TASK", (deletedTask) => {
      console.log("[TasksHome] Tâche reçue via Eventbus :", deletedTask)

      setTasks(prev => prev.filter(task => task._id !== deletedTask._id));
      toastService.show('Tâche supprimé', 'primary')
    });

    return () => unsubDeleted();
  }, [])


  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CategoriesHome user={user} categories={categories} setCategories={setCategories} />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/categorie/:id" element={<CategoriePage user={user} tasks={tasks} setTasks={setTasks} />} />
        <Route path="/MonCompte" element={<MonCompte user={user} loading={loading} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <GlobalToast/>
    </BrowserRouter>

  )
}

export default App
