import React, { useState } from "react";
import CategoryList from "./CategoryList";

const AddCategory = ({ fetchCategorie }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);


        try {
            //exemple de rêquete POST avec fetch
            const response = await fetch('http://localhost:3001/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description }),
            });

            if (response.ok) {
                //Reinitialiser les champs et revenir au bouton initial
                fetchCategorie();
                setName('');
                setDescription('');
                setIsAdding(false);
            } else {
                throw new Error("Echec de L'envoi")
            }
        } catch (err) {
            console.error('Erreur:', err);
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div>
            {!isAdding ? (
                <button
                    onClick={() => setIsAdding(true)}
                    className="add-button">
                    <span>+</span>
                </button>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nom : </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Description : </label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Envoi en cours... ' : 'Envoyer'}
                    </button>
                </form>
            )}
        </div>
    );
};



export default AddCategory;