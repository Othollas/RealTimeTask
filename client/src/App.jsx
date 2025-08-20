
import { useState } from 'react';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import CategoryList from './components/CategoryList'
import AddCategory from './components/CreateCategorie'


function App() {

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const fetchCategorie = async () => {
    fetch("http://localhost:3001/api/categories")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur de chargement");
        return res.json();
      })
      .then((data) => setCategories(data))
      .catch((err) => setError(err.message))
  }

  if (error) return <p>erreur : {error}</p>;

  return (

    <div>
      <CategoryList categories={categories} fetchCategorie={fetchCategorie} />
      <AddCategory fetchCategorie={fetchCategorie} />
    </div>


  )
}

export default App
