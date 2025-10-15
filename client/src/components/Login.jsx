/**
 * Composant Login
 * 
 * Rôle :
 * Formulaire permettant de Logguer l'utilisateur avec son email et son mot de passe.
 * Redirige vers la page d'accueil si la connexion est réussi.
 * 
 * 
 * Entrées (props):
 * onLogin : fonction appelée avec true si la connexion est valide 
 * 
 * Sorties / Effets :
 *  - Appel API pour vérifier les identifiants
 *  - Redirection si la connexion reussit
 *  - Affiche un message d'erreur générique si les identifiants sont invalides  
 *
 * 
 * Sécurité :
 *  - Un seul état d'erreur (boolean) pour éviquer de donner trop d'information 
 *  (ne pas révéler si l'erreur vient de l'email ou du mot de passe)
 * 
 * 
 * TODOS / FIXME :
 *  - Ajouter de la sécurité pour le mot de passe en porduction, pour le moment laisser simple pour les tests
 *  - Envlever le type text du champs password et le remplacer par le champ password 
 * 
 */

import { useState } from "react";
import { login } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";


const Login = ({ onLogin, setCategories, setIsGroup }) => {
    // Gestion des states du formulaire 
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

/**
 * 
 * Fonction de soumission du formulaire
 *  - Vérifie localement la longueur minimale des champs  
 *  - Apelle l'API login 
 *  - Si succès : met à jour l'état global + redirige 
 *  - Si echec : affichage erreur global 
 */

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Vérification simple (longueur minimale)  !! A modifier pour la prod !! augmenter la sécurité
        if (email.length < 6 ) { setError(true) }
        password.length < 6 ? setError(true) : setError(false);

        // Donnée envoyer à l'API 
        const data = { email: email, password: password };

        if (!error) {
            try {
                const result = await login(data);

                // L'API renvoie une clé "find" si l'utilisateur existe
                result.find ? console.log("login reussi", result) : console.log("login raté", result);
            
                if (result.find) { 
                    
                    if(result.group) setIsGroup(true); // Si l'utilisateur à un groupe
                    onLogin(true); // informe l'app que l'utilisateur est connecté
                    setCategories([]) // reset les catégories pour eviter l'erreur quand on passe de localstorage à bdd
                    navigate("/", { replace: true }) // redirection accueil
                }else{
                    setError(true);
                } 
                
            } catch (error) {
                console.error("Erreur :", error.message);
            }
        }
    }

    return (
        <>
            <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <form onSubmit={handleSubmit} >
                    <div className="">
                        {/* Champ email */}

                        <div className="my-5 row">
                            <label htmlFor="email" className="col-4">email</label>
                            <input className="col-8" type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                          {/* Champ mot de passe */}
                        <div className="my-5 row">
                            <label className="col-4" htmlFor="password">password</label>
                            <input className="col-8" type="text" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        {/* Lien vers l'inscription */}
                        <div className="m-5 d-block">
                            <Link to={"/register"}> pas encore enregistrer ? </Link>
                        </div>
                        
                        {/* Message d'erreur générique */}
                        {error && <p style={{ color: "red" }}>Tu as une erreur</p>}
                        
                         {/* Bouton de soumission */}
                        <button type="submit" className="my-5 mt-5 btn btn-success" >Envoyer</button>
                    </div>
                </form>
            </div>
        </>
    )
};

export default Login;