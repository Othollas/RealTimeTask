import { useEffect } from "react";


export default function CategoryList({ categories, fetchCategorie }) {

    useEffect(() => {
        fetchCategorie();
    }, [])



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

