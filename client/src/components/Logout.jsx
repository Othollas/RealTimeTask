/**
 * Composant Logout
 * 
 * Rôle :
 * Permet de déconnecter l'utilisateur en appelant l'API `logout` et redirige ensuite vers la page de login 
 * 
 * Entrées : 
 * - Aucune (le composant est autonome)
 * 
 * Sorties / Effets :
 * - Appelle l'API de déconnection
 * - Nettoie la session côté serveur 
 * - Redirige vers "/login" 
 * 
 * 
 */

import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth"

const Logout = ({setIsGroup}) => {

   const navigate = useNavigate();


   /**
    * Gère la déconnexion 
    *    - Bloque le comportement par défaut du bouton
    *    - Appelle l'API logout 
    *    - Redirige vers la page login si succès
    */
   const handleLogout = async (e) => {
      e.preventDefault()
      try {
         let data = await logout();
         console.log(data.message) // TODO : à retirer en production

         if (data) {
            setIsGroup(false);
            navigate("/login", { replace: true })
         }
      } catch (err) {
         console.error("Erreur lors du logout", err)
      }
   };

   return (
      // Bouton de déconnexion
      <button className="btn btn-danger m-5" onClick={handleLogout}>Logout </button>
   )
}

export default Logout