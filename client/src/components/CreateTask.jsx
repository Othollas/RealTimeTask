import React, { useState } from "react";


const AddTask = ({ fetchTasks, id_category }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            //exemple de rêquete POST avec fetch
            const response = await fetch('http://localhost:3001/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, id_category }),
            });

            if (response.ok) {
                //Reinitialiser les champs et revenir au bouton initial
                fetchTasks();
                setTitle('');
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

    const handleReset = () => {
        setTitle('');
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
                                value={title}
                                className="form-control-plaintext rounded-pill shadow "
                                htmlFor="name"
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <label id="name">Titre : </label>
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



export default AddTask;