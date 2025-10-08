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

const MonCompte = ({ user, loading }) => {

    // State local : titre du groupe de l'utilisateur 
    const [group, setGroup] = useState(false);

    // State local : Groupe de l'utilisateur 
    const [userGroup, setUserGroup] = useState([]);
    const navigate = useNavigate();


console.log(userGroup) // ⚠️ log temporaire à enlever en prod

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

    // Fonction pour récupérer les données du groupe depuis l'API 
    const fetchGroup = async () => {
        // Fetch pour récuperer les groupe (ou les personnes dans le groupe pour les afficher )
        fetch("http://localhost:3001/api/group", {
            credentials:"include", // Pour inclure les cookies/Session
            method: "GET"
        })
        .then((res)=>{
            if(!res.ok){ throw new Error("erreur dans la demande du titre")}
            return res.json()
        })
        .then(data=> {
            // Met à jour l'état avec les données reçues
            setGroup(data.titre_groupe); // Nom du groupe
            setUserGroup(data.nom_groupe); // Liste des utilisateurs
        })
        .catch( err=> {
            console.error("Erreur fetchGroup", err)
        }) 
    }


    return (

        <div>
            <h2>MonCompte</h2>
            <p>Nom du groupe : {group ? group : null}</p>
            {}
            {/* <ul>Personne dans le groupe : {userGroup.map(user=> <li key={user._id}>{user.username}</li> )} </ul> */}
            <button onClick={()=>navigate("/", {replace:true})}>Acceuil</button>
        </div>
    )


};

export default MonCompte;