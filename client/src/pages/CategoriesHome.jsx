/**
 * Composant de CategorieHome
 * 
 * Rôle :
 *  - Affiche la page principale des catégories
 *  - Charge les catégories depuis la BDD (si user connecté) ou depui sle localStorage (si invité)
 *  - Initialise des catégories et tâches par défaut pour un invité 
 *  - Permet de réinitialiser les catégories locales
 * 
 * Props :
 *  - User {Boolean } : indique si l'utilisateur est connecté
 *  - categories {array | object} : tableau des catégories
 *  - setCategories {function} : setter pour mettre à jour les catégories
 * 
 * Etat interne :
 *  - error {String | null} : message d'erreur lors du fetch
 *  - name {String} : npm ou alias affiché (ex. "Guest" ou username)
 *
 * Effets :
 *  - useEffect : déclenche le chargement des catégories au montage et quand `user` change 
 */


import { useEffect, useState } from 'react';
import CategoryList from '../components/CategoryList'
import AddCategory from '../components/CreateCategorie'
import categorieTemplate from '../template/categorieTemplate';
import taskTemplate from '../template/taskTemplate';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'bootstrap';
import Logout from '../components/Logout';


const CategoriesHome = ({ user, categories, setCategories, setIsGroup }) => {


  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const navigate = useNavigate();



  useEffect(() => {
    fetchCategorie();
  }, [user]);



  // --------------------------
  // Initialisation des catégories et tâches locales
  // --------------------------
  const initializeCategorie = () => {
    const defaultCategorie = categorieTemplate; // J'utilise un template pour le format de mes categories
    const defaultTask = taskTemplate(null);

    // Attribution des IDs de catégorie aux tâches par défaut
    defaultCategorie.forEach((element, index) => {
      defaultTask[index].category_id = element._id;
    });

    // Stockage dans localStorage
    localStorage.setItem("defaultCategorie", JSON.stringify(categorieTemplate));
    localStorage.setItem("defaultTasks", JSON.stringify(defaultTask));

    // Mise à jour de l'état
    setName("Guest");
    setCategories(JSON.parse(localStorage.getItem("defaultCategorie")));
  }


  // --------------------------
  // Rechargement des catégories
  // --------------------------
  const fetchCategorie = async () => {

    // Invité
    if (!user) {

      if (!("defaultCategorie" in localStorage)) {

        initializeCategorie();

      } else {
        const localCategories = localStorage.getItem("defaultCategorie");
        setCategories(JSON.parse(localCategories))
        setName("Guest")
      }
    }

    // Utilisateur connecté 
    if (user) {
      try {
        const res = await fetch("http://localhost:3001/api/categories", {
          method: "GET",
          credentials: "include"
        });
        
        if (!res.ok) throw new Error("Erreur de chargement ")

        const data = await res.json();
        setCategories(data.categories);
        setName(data.username);

      } catch (err) {
        setError(err.message);
      }
    }
  }


  if (error) return <p>erreur : {error}</p>;

  // --------------------------
  // Rendu JSX
  // --------------------------
  return (

    <div className='text-center'>
      {/* Bouton "Mon compte" si user connecté */}
      {user ? <button className='mt-2' onClick={() => navigate("./moncompte", { replace: true })}>Mon compte</button> : null}
      
      {/* Bouton reset catégories locales si liste vide */}
      {localStorage.getItem("defaultCategorie") === '[]' && <Button className='m-2' type="submit" variant='primary' onClick={initializeCategorie} >Reset les categories</Button>}

      {/* Bouton login si non connecté */}
      {!user && <Button 
      className='mt-2'
      variant="primary" 
      onClick={() => { navigate("/login") }}>
        login
        </Button>}
       
         {user && <Logout setIsGroup={setIsGroup}/>}

       {/* Liste des catégories */}
      <CategoryList 
      categories={categories} 
      fetchCategorie={fetchCategorie} 
      username={name} 
      user={user} 
      />

      {/* Ajout de catégorie */}
      <AddCategory 
      fetchCategorie={fetchCategorie} 
      user={user} 
      />

    </div>


  )
};

export default CategoriesHome;