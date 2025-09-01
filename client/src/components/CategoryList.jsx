import { useEffect } from "react";
import CardCategorie from "./CardCategorie";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

export default function CategoryList({ categories, fetchCategorie, username }) {



    useEffect(() => {
        fetchCategorie();
    }, [])



    return (
        <div className="text-center">
            <h2 className="m-5">Catégories</h2>
            {username !== '' ? <p>Bienvenue {username}</p> : ''}
            <Container>
                <Row className="gap-3 justify-content-center">
                    {categories.map((cat)=>(<CardCategorie key={cat._id} categorie={cat} fetchCategorie={fetchCategorie} />))}
                </Row>
            </Container>
        </div>
    );
}

