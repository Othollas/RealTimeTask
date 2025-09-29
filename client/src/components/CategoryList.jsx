/**
 * Composant CategoryList
 * 
 * Rôle : 
 * Affiche la liste des categories reçue depuis la fcontion fetchCategorie.
 * Mappe chaque catégorie  dans le composant CardCategorie
 * Affiche dynamiquemeent le bouton Logout si l'utilisateur est connecté 
 * 
 * Entrée :
 *  - Categorie : tableau d'Object {_id, name, description, created_at, updated_at }
 *  - fetchCategorie : fonction pour récupéré / recharger la liste des catégories
 *  - username {String : nom de l'user si connecté }
 *  - user { boolean }
 * 
 * 
 * Sorties / Effets :
 *  - Mappe les objets categories dans des composants CardCategorie avec key unique 
 *  - Affiche le bouton Logout si user est true
 * 
 * TODOS / FIXME :
 *  - Externaliser le composant Logout 
 *  - Pour plus tard, prevoir une separation - branche pour quand les users auront un groupe (soit une sauvegarde, soit un affichage des categorie perso - categorie du groupe)
 */


import { useEffect } from "react";
import CardCategorie from "./CardCategorie";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Logout from "./Logout";




export default function CategoryList({ categories, fetchCategorie, username, user }) {


// Récupération des categories au montage
    useEffect(() => {
        // TODO: gérer erreurs réseau et feedback utilisateur
        fetchCategorie();
    }, [])

    return (
        <div className="text-center">
            <h2 className="m-5">Catégories</h2>
            <p>Bienvenue {username}</p>
            {user && <Logout />}

            <Container>
                <Row className="gap-3 justify-content-center">
                    {categories.map((cat) => (
                        <CardCategorie
                            key={cat._id}
                            categorie={cat}
                            fetchCategorie={fetchCategorie}
                            user={user}
                        />
                    ))}
                </Row>
            </Container>
        </div>
    );
}

