
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CategoriesHome from './pages/CategoriesHome'
import CategoriePage from './pages/CategoriePage'
import NotFound from './pages/NotFound'


function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<CategoriesHome />} />
        <Route path="/categorie/:id" element={<CategoriePage />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
