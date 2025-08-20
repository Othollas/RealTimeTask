import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import img from "/vite.svg?url"
import { useState } from 'react';



const CardCategorie = ({ categorie, fetchCategorie }) => {

    const [isModify, setIsModify] = useState(false);
    const [name, setName] = useState(categorie.name);
    const [description, setDescription] = useState(categorie.description);
    const created_at = categorie.created_at;


    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/categories/${categorie._id}`, {
                method: "DELETE"
            });

            const data = await response.json();
            console.log('Réponse serveur:', data);

            if (!response.ok) {
                throw new Error(data.message || `Erreur ${response.status}`);
            }

            console.log('✅ Supprimé avec succès');

        } catch (err) {
            console.error('Erreur:', err);
        } finally {
            fetchCategorie();
        }
    };

    const handleModify = async () => {


        try {
            const response = await fetch(`http://localhost:3001/api/categories/${categorie._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, created_at })
            })

            const data = await response.json();
            console.log('Réponse serveur:', data);

            if (!response.ok) {
                throw new Error("Erreur")
            }


        } catch (err) {
            console.error(err)
        } finally {
            setIsModify(false);
            fetchCategorie();
        }
    }

    return (
        <Card style={{ width: '15rem' }}>
            <Card.Img className='mt-2' variant="top" src={img} />
            <Card.Body className='text-center' >
                <Card.Title>{categorie.name}</Card.Title>
                <Card.Text>{categorie.description}</Card.Text>
                <div className='text-center'  >
                    {!isModify ? (
                        <Button as='a' className='m-1' variant="primary" action={null} onClick={() => setIsModify(true)}>Modifier
                        </Button>
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
                            <Button type="submit" variant='primary'>
                                Envoyer
                            </Button>
                            <Button type="submit" variant='danger' onClick={()=>setIsModify(false)}>
                                retour
                            </Button>
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