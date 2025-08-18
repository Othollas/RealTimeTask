import { useEffect, useState } from "react";

export default function CategoryList() {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3001/api/categories")
            .then((res) => {
                if (!res.ok) throw new Error("Erreur de chargement");
                return res.json();
            })
            .then((data) => setCategories(data))
            .catch((err) => setError(err.message))
    }, [])

    if (error) return <p>erreur : {error}</p>;

    return (
        <div>
            <h2>Catégories</h2>
            <ul>
                {categories.map((cat) => 
   
                    (
                        <li key={cat._id}>{cat.name}</li>
                    )
                
                )
                }
            </ul>
        </div>
    );
}

