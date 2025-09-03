import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import img from "/vite.svg?url"
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';



const CardCategorie = ({ categorie, fetchCategorie }) => {
    const [count, setCount] = useState(0);
    const [isModify, setIsModify] = useState(false);
    const [name, setName] = useState(categorie.name);
    const [description, setDescription] = useState(categorie.description || "");
    const created_at = categorie.created_at;

    useEffect(() => {
        getTaskCount(categorie._id)
    }, [])

    const getTaskCount = async (id) => {

        try {
            const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
                credentials: "include"
            });
            const data = await response.json();
            const { tasks, source } = await data;
            if (source === "db") {
                setCount(tasks.length)
            } else if (source === "Guest") {

                const localTasks = JSON.parse(localStorage.getItem("defaultTasks"));
                const taskMatched = localTasks.filter(task => {
                    if (id === task.category_id) {
                        return task
                    }
                })
                setCount(taskMatched.length);
            }
        } catch (error) {
            console.error(error)
        } finally {
            fetchCategorie();
        };
    }

    const handleDelete = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3001/api/categories/${categorie._id}`, {
                method: "DELETE",
                credentials: "include"
            });

            const data = await response.json();

            if (data.source === "db") {

                console.log('Réponse serveur:', data);

                if (!response.ok) {
                    throw new Error(data.message || `Erreur ${response.status}`);
                }

                console.log('✅ Supprimé avec succès');

            } else if (data.source === "Guest") {
                const storageCategorie = JSON.parse(localStorage.getItem("defaultCategorie"));
                const newStorage = storageCategorie.filter(element => {
                    return element._id !== categorie._id;
                });

                localStorage.setItem("defaultCategorie", JSON.stringify(newStorage));
            }

        } catch (err) {
            console.error('Erreur:', err);
        } finally {
            fetchCategorie();
        }
    };

    const handleModify = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3001/api/categories/${categorie._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, created_at }),
                credentials: "include"
            })

            const data = await response.json();
            console.log('Réponse serveur:', data);

            if (data.source === "db") {
                if (!response.ok) {
                    throw new Error("Erreur")
                }
            } else if (data.source === "Guest") {

                const oldStorageCategorie = JSON.parse(localStorage.getItem("defaultCategorie"))

                const newStorage = oldStorageCategorie.map(element => {
                    if (element._id === categorie._id) {
                        return {
                            ...element,
                            name: data.updatedCategorie.name,
                            description: data.updatedCategorie.description,
                            owner: data.updatedCategorie.owner,
                            created_at: data.updatedCategorie.created_at,
                            updated_at: data.updatedCategorie.updated_at
                        }
                    }
                    return element
                })
                localStorage.setItem("defaultCategorie", JSON.stringify(newStorage))
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsModify(false);
            fetchCategorie();
        }
    }


    return (
        <Card className="shadow" style={{ width: '15rem' }}>
            <Link to={`/categorie/${categorie._id}`}><Card.Img className='mt-2' variant="top" src={img} /></Link>

            <Card.Body className='text-center' >
                <Link to={`/categorie/${categorie._id}`}><Card.Title>{categorie.name}</Card.Title></Link>
                <Card.Text>{categorie.description}</Card.Text>
                <Card.Text>{count === 1 || count === 0 ? `Vous avez ${count} tache` : `Vous avez ${count} taches`}</Card.Text>
                <div className='text-center'>
                    {!isModify ? (
                        <>
                            <Button as='a' className='m-1' variant="primary" action={null} onClick={() => setIsModify(true)}>Modifier
                            </Button>
                        </>

                    ) : (
                        <form onSubmit={handleModify}>
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
                                    className='m-0 p-0'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            {/* <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Envoi en cours... ' : 'Envoyer'}
                        </button> */}
                            <Button className='m-2' type="submit" variant='primary'>
                                Envoyer
                            </Button>
                            <Button className='m-2 ' type="submit" variant='close' onClick={() => setIsModify(false)}></Button>
                        </form>
                    )}
                </div>
                {!isModify ? (
                    <Button as='a' className='m-1' variant="danger" action={null} onClick={handleDelete} >suppr</Button>
                ) : (
                    <Button as='a' className='m-1 d-none' variant="danger" action={null} onClick={handleDelete} >suppr</Button>
                )}

            </Card.Body>
        </Card>
    )

}

export default CardCategorie;