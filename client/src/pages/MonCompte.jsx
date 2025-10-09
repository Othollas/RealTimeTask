/**
 *  Composant MonCompte
 * 
 * Rôle : 
 * Affiche les informations du groupe de l'utilisateur et la liste des membres.
 * Redirige vers l'acceueil si l'utilisateur n'est pas connecté.
 * 
 * Entrées (props) :
 * -user : Boolean indique si il y a un utilisateur (Affiner les details) 
 * - loading : Boolean, indique si les infos utilisateur sont en cours de chargement.
 * 
 * Sorties / Effets : 
 * -Navigue vers "/" (accueil) si l'utilisateur n'est pas connecté
 * -Récupère via fetch les infos groupe et liste de membres
 * - Met à jour l'etat local : group (nom du groupe), userGroup (liste de membre) 
 */

import { Error } from "mongoose";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MonCompte = ({ user, loading, isGroup }) => {

    // State local : titre du groupe de l'utilisateur 
    const [group, setGroup] = useState(false);

    // State local pour controler le bouton d'ajout de groupe
    const [buttonGroup, setButtonGroup] = useState(false);

    // State local afin de controle le formulaire d'ajout du groupe
    const [formNewgroup, setFormNewGoup] = useState(false);
    // State local : Groupe de l'utilisateur 
    const [userGroup, setUserGroup] = useState([]);
    const navigate = useNavigate();




    // Redirige l'utilisateur vers l'acceuil s'il n'est pas connecté
    useEffect(() => {
        if (!user && !loading) {
            navigate("/", { replace: true })
        }
    }, [loading]) // Dépend du chargement, pas besoin de rajouter user.


    // au montage du composant, recuperation  des info du groupe
    useEffect(() => {
        fetchGroup();
    }, [])

    useEffect(() => {
        !isGroup && !loading ? setButtonGroup(true) : setButtonGroup(false)
    }, [isGroup])

    // Fonction pour récupérer les données du groupe depuis l'API 
    const fetchGroup = async () => {
        // Fetch pour récuperer les groupe (ou les personnes dans le groupe pour les afficher )
        fetch("http://localhost:3001/api/group", {
            credentials: "include", // Pour inclure les cookies/Session
            method: "GET"
        })
            .then((res) => {
                if (!res.ok) { throw new Error("erreur dans la demande du titre") }
                return res.json()
            })
            .then(data => {
                // Met à jour l'état avec les données reçues
                setGroup(data.titre_groupe); // Nom du groupe
                setUserGroup(data.nom_groupe); // Liste des utilisateurs
            })
            .catch(err => {
                console.error("Erreur fetchGroup", err)
            })
    }

    // fonction pour afficher le formulaire de creation de groupe
    const handleFormGroup = () => {
        setButtonGroup(false);
        setFormNewGoup(true);
    }

    // formulaire de 


    return (

        <div>
            <h2>MonCompte</h2>
            {group ?

                (<div className="m-5"><p>Nom du groupe</p> <p> {group}</p></div>) :
                (<div className="m-5"><p>Vous n'avez pas de groupe, en crée un ? </p> <button className="btn btn-warning" onClick={null}>Crée un groupe</button></div>)
            }

            {buttonGroup && <button onClick={handleFormGroup}>Ajouter au groupe</button>}

            {group ?
                (<ul>Personne dans le groupe :  <div className="list-group"> {userGroup.map(user => <div key={user._id} className="container d-flex"> <a href="#" className="list-group-item list-group-item-action" >{user.username}  <button className="btn btn-danger" >suprimer</button> <button className="btn btn-warning" >modifier</button></a></div> )} </div></ul>)
                :
                (null)
            }

            <button className="btn btn-info m-5" onClick={() => navigate("/", { replace: true })}>Acceuil</button>
        </div>
    )


};

export default MonCompte;