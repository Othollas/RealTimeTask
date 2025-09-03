import React, { useState } from "react";
import CategoryList from "./CategoryList";
import Button from "react-bootstrap/esm/Button";

const AddCategory = ({ fetchCategorie }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const resetAddinginput = () => {
        fetchCategorie();
        setName('');
        setDescription('');
        setIsAdding(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            //exemple de rêquete POST avec fetch
            const response = await fetch('http://localhost:3001/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description }),
                credentials: "include",
            });
            const data = await response.json()
            
            
            if (data.source === "Guest") {
                const localCategorie = JSON.parse(localStorage.getItem("defaultCategorie"));
                const newLocalCategorie = [...localCategorie, data.newCategorie];
                localStorage.setItem("defaultCategorie", JSON.stringify(newLocalCategorie));
                  resetAddinginput();
            } else if (response.ok) {
                //Reinitialiser les champs et revenir au bouton initial
                resetAddinginput();
            } else {
                throw new Error("Echec de L'envoi")
            }
        } catch (err) {
            console.error('Erreur:', err);
        } finally {
            fetchCategorie()
            setIsLoading(false)
        }
    };

    const handleReset = () => {
        setName('');
        setDescription('');
        setIsAdding(false);
    }


    return (
        <div className="position-absolute">
            {!isAdding ? (

                <button
                    onClick={() => setIsAdding(true)}
                    className="btn btn-warning position-fixed bottom-0 start-0 m-4 shadow">
                    <span>+</span>
                </button>
            ) : (

                <>
                    <form
                        onSubmit={handleSubmit}
                        className="position-fixed 
                        bottom-0 
                        start-0  
                        text-start 
                        form m-3 
                        border 
                        text-bg-light 
                        p-3 
                        shadow 
                        d-flex 
                        align-items-center
                        rounded-pill"
                    >
                        <div className="form-floating me-5">
                            <input
                                type="text"
                                value={name}
                                className="form-control-plaintext rounded-pill shadow "
                                htmlFor="name"
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label id="name">Nom : </label>
                        </div>

                        <div className="form-floating me-5">

                            <input
                                type="text"
                                value={description}
                                htmlFor="description"
                                className="form-control-plaintext p-2 rounded-pill shadow"
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <label id="description">Description : </label>
                        </div>
                        <button className="btn btn-outline-success" type="submit" disabled={isLoading}>
                            {isLoading ? 'Envoi en cours... ' : 'Envoyer'}
                        </button>
                        <button className="btn-close ms-4 p-4" type="submit" onClick={handleReset}>

                        </button>
                    </form>
                </>

            )}
        </div>
    );
};

export default AddCategory;