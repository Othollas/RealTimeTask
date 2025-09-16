
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



function App() {

  const [user, setUser] = useState(false) //user = {info, token}
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);


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

  }, [])


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


  useEffect(() => {
    const unsubDeleted = EventBus.subscribe("DELETED_CATEGORY", (deletedCat) => {
      console.log("[CategoriesHome] Catégorie reçue via Eventbus :", deletedCat)
      setCategories(prev => prev.filter(category => category._id !== deletedCat.deletedCategory._id));
      console.log("Suppresion Categorie : ", deletedCat)
    });

    return () => unsubDeleted();
  }, [])


  useEffect(() => {
    const unsubModify = EventBus.subscribe("UPDATE_CATEGORY", (modifiedCat) => {
      console.log("[CategoriesHome] Caégorie reçu via Eventbus :", modifiedCat);
      setCategories(prev => prev.map(category => category._id === modifiedCat.updatedCategory._id ? modifiedCat.updatedCategory : category))
    });

    return () => unsubModify();
  }, [])


  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CategoriesHome user={user} categories={categories} setCategories={setCategories} />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/categorie/:id" element={<CategoriePage user={user} tasks={tasks} setTasks={setTasks} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <GlobalToast/>
    </BrowserRouter>

  )
}

export default App
