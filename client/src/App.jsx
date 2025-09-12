
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CategoriesHome from './pages/CategoriesHome'
import CategoriePage from './pages/CategoriePage'
import NotFound from './pages/NotFound'
import Login from './components/Login'
import Register from './components/Register'
import { useEffect, useState } from 'react'
import { connectSocket } from './service/webSocketService'
import { EventBus } from './service/bus'




// const socket = new WebSocket('ws://localhost:8080');

// socket.onopen = () => {
//   console.log('Connecté');
//   socket.send(JSON.stringify({ type: 'hello', content: 'Salut server' }));
// };

// socket.onmessage = (event)=>{
//   console.log('Message server:', event.data)
// }

function App() {

  const [user, setUser] = useState(false) //user = {info, token}
  

  useEffect(() => {
    fetch("http://localhost:3001/api/auth/me", {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          console.log("user log", data.user);
          setUser(true)
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
          console.log("[App] Message WS reçu :", msg);
          EventBus.publish(msg.type, msg.payload);
        } catch (error) {
          console.error("Message WS invalide", error.data);
        }
      }
      return () => ws.close()
    }
  }, [user])

 const testCreateCategory = () => {
    const fakeCategory = { _id: "fake123", name: "Catégorie TEST" };
    console.log("[App] Publication manuelle :", fakeCategory);
    EventBus.publish("CREATE_CATEGORY", fakeCategory);
  };


  return (
    <> <button onClick={testCreateCategory}>Tester CREATE_CATEGORY</button>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CategoriesHome user={user} />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/categorie/:id" element={<CategoriePage user={user} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
