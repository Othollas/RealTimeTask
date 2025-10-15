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
 * - Met à jour l'etat local : groupName (nom du groupe), userGroup (liste de membre) 
 */

import { Error } from "mongoose";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormGroup from "../components/FormGroup";

const MonCompte = ({ user, loading, isGroup, setIsGroup }) => {

    // State local : titre du groupe de l'utilisateur 
    const [groupName, setGroupName] = useState('');

    const [objectGroup, setObjectGroup] = useState({});

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
        console.log("🔄 useEffect [] executé");
        fetchGroup();

    }, [])

    useEffect(() => {
        !isGroup && !loading ? setButtonGroup(true) : setButtonGroup(false)
    }, [isGroup, loading])

    // Fonction pour récupérer les données du groupe depuis l'API 
    const fetchGroup = async () => {
        // Fetch pour récuperer les groupe (ou les personnes dans le groupe pour les afficher )
        await fetch("http://localhost:3001/api/group", {
            credentials: "include", // Pour inclure les cookies/Session
            method: "GET"
        })
            .then((res) => {
                if (!res.ok) { throw new Error("erreur dans la demande du titre") }
                return res.json({message : "demande du titre ?"})
            })
            .then(data => {
                // Met à jour l'état avec les données reçues
                setGroupName(data.infoGroupe.groups.group_name); // Nom du groupe
                setUserGroup(data.nom_groupe); // Liste des utilisateurs
                setObjectGroup(data.infoGroupe.groups) // stocke l'objet group pour recuperer l'id du groupe
            })
            .catch(err => {
                console.error("Erreur fetchGroup", err)

            }).finally(setFormNewGoup(false))
    }

    const deletedGroup = async () => {
       
        try {
            const response = await fetch(`http://localhost:3001/api/group/${objectGroup._id}`, {
                method: "DELETE",
                credentials: "include"
            });

            const data = await response.json();

            if(data.valid){
                setIsGroup(false)
                setGroupName('')
            }
        } catch (error) {
            console.error(error)
        } finally {
            fetchGroup();
        }
    }



    // fonction pour afficher le formulaire de creation de groupe
    //    const handleFormGroup = () => {
    //         setButtonGroup(false);
    //         setFormNewGoup(true);
    //     }

    // formulaire de 


    return (

        <div>
            <h2>MonCompte</h2>
            <div className="d-flex ">
                {groupName ?

                    (
                        <div className="m-5">
                            <p>Nom du groupe</p>
                            <p> {groupName}</p>
                        </div>
                    )

                    :

                    (
                        <div className="m-5">
                            <p>Vous n'avez pas de groupe, en crée un ? </p>
                            <button className="btn btn-warning" onClick={() => setFormNewGoup(!formNewgroup)}>Crée un groupe</button>
                        </div>
                    )
                }


                {formNewgroup && <FormGroup fetchGroup={fetchGroup} setIsGroup={setIsGroup} />}
                {isGroup  && <button className="btn btn-danger" onClick={deletedGroup}>Supprimer le groupe</button>}
            </div>
            {/* {buttonGroup && <button onClick={handleFormGroup}  setFormNewGoup={setFormNewGoup}>Ajouter au groupe</button>} */}

            {groupName ?
                (<ul>Personne dans le groupe :  <div className="list-group"> {userGroup.map(user => <div key={user._id} className="container d-flex"> <a href="#" className="list-group-item list-group-item-action" >{user.username}  <button className="btn btn-danger" >suprimer</button> <button className="btn btn-warning" >modifier</button></a></div>)} </div></ul>)
                :
                (null)
            }

            <button className="btn btn-info m-5" onClick={() => navigate("/", { replace: true })}>Acceuil</button>
        </div>
    )


};

export default MonCompte;