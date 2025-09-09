
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CategoriesHome from './pages/CategoriesHome'
import CategoriePage from './pages/CategoriePage'
import NotFound from './pages/NotFound'
import Login from './components/Login'
import Register from './components/Register'


// const socket = new WebSocket('ws://localhost:8080');

// socket.onopen = () => {
//   console.log('Connecté');
//   socket.send(JSON.stringify({ type: 'hello', content: 'Salut server' }));
// };

// socket.onmessage = (event)=>{
//   console.log('Message server:', event.data)
// }

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CategoriesHome />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/categorie/:id" element={<CategoriePage />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
