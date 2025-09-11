import { useEffect, useState } from 'react';
import CategoryList from '../components/CategoryList'
import AddCategory from '../components/CreateCategorie'
import categorieTemplate from '../template/categorieTemplate';
import taskTemplate from '../template/taskTemplate';
import Button from 'react-bootstrap/Button';
import { connectSocket } from '../service/webSocketService';
import { useNavigate } from 'react-router-dom';


const CategoriesHome = ({ user }) => {

  useEffect(() => {
    if (user) {
      const ws = connectSocket();
      console.log(ws)
    }

  }, []);



  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const initializeCategorie = () => {
    const defaultCategorie = categorieTemplate;

    const defaultTask = taskTemplate(null);

    defaultCategorie.map((element, index) => {
      defaultTask[index].category_id = element._id;
    });

    localStorage.setItem("defaultCategorie", JSON.stringify(categorieTemplate));

    localStorage.setItem("defaultTasks", JSON.stringify(defaultTask));

    setName("Guest");

    setCategories(JSON.parse(localStorage.getItem("defaultCategorie")));
  }

  const handleResetCategorie = () => {

    initializeCategorie();
  }

  const fetchCategorie = async () => {

    if (!user) {

      if (!("defaultCategorie" in localStorage)) {

        initializeCategorie();

      } else {
        const localCategories = localStorage.getItem("defaultCategorie");
        setCategories(JSON.parse(localCategories))
        setName("Guest")
      }
    }

    if (user) {
      fetch("http://localhost:3001/api/categories", {
        method: "GET",
        credentials: "include"
      })
        .then((res) => {
          if (!res.ok) throw new Error("Erreur de chargement");
          return res.json();
        })
        .then((data) => {
          setCategories(data.categories);
          setName(data.username);
        })
        .catch((err) => setError(err.message))
    }


  }



  // const fetchCategorie = async () => {
  //   fetch("http://localhost:3001/api/categories", {
  //     method: "GET",
  //     credentials: "include"
  //   })
  //     .then((res) => {
  //       if (!res.ok) throw new Error("Erreur de chargement");
  //       return res.json();
  //     })
  //     .then((data) => {

  //       if (data.source === "db") {
  //         setCategories(data.categories);
  //         setName(data.username);
  //       } else if (!("defaultCategorie" in localStorage)) {
  //         const defaultCategorie = categorieTemplate;

  //         const defaultTask = taskTemplate(null);

  //         defaultCategorie.map((element, index) => {
  //           defaultTask[index].category_id = element._id;
  //         });

  //         localStorage.setItem("defaultCategorie", JSON.stringify(categorieTemplate));

  //         localStorage.setItem("defaultTasks", JSON.stringify(defaultTask));
  //         setName(data.username);

  //         setCategories(JSON.parse(localStorage.getItem("defaultCategorie")));

  //       } else {
  //         const localCategories = localStorage.getItem("defaultCategorie");
  //         setCategories(JSON.parse(localCategories))
  //       }
  //     })
  //     .catch((err) => setError(err.message))
  // }

  if (error) return <p>erreur : {error}</p>;


  return (

    <div className='text-center'>

      {localStorage.getItem("defaultCategorie") === '[]' && <Button className='m-2' type="submit" variant='primary' onClick={handleResetCategorie} >Reset les categories</Button>}
      {name === "Guest" && <Button className='mt-2' variant="primary" onClick={() => { navigate("/login") }}>login</Button>}
      <CategoryList categories={categories} fetchCategorie={fetchCategorie} username={name} user={user}/>
      <AddCategory fetchCategorie={fetchCategorie} />
    </div>


  )
};

export default CategoriesHome;