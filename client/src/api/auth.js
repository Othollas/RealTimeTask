/**
 * Module auth 
 * 
 * Rôle : 
 * Fournit les fonctions pour gérer l'authentification de l'utilisateur :
 * inscription, connexion et déconnexion via l'API backend.
 * 
 * Fonction exportées :
 * - register(userData) : envoie les données d'inscription et retournne la reponse JSON
 * -login(userDate) : envoie les données de connection et retourne la réponse JSON
 * -logout() : déconnecte l'utilisateur et retourne la réponse JSON
 * 
 * TODO / FIXME :
 * 
 * -Ajouter gestion d'erreur (try/catch) pour intercepter les erreurs réseau ou JSON
 * -Ajouter validation côté client pour userData avant l'envoi
 * -externaliser l'URL de l'API dans un fichier de configuration pour production (.env par exemple)
 * 
 */

const url = "http://localhost:3001/api/auth";

/**
 * 
 * @param {object} userData - données utilisateur  {username, email, password....}
 * @returns {Promise<Object>} - résponse JSON de l'API 
 */

export const register  =  async (userData) => {
    // TODO : Ajouter validation des champs userData avant fetch
    const response = await fetch(`${url}/register`, {
        method: "POST",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify(userData)
    });

    // TODO : gérer les erreurs réseau ou JSON
    return response.json();
}


/**
 * Déconnecte l'utilisateur
 * @returns {Promise<Object>} - réponse JSON de l'API
 */
export const logout = async () => {

    const response = await fetch(`${url}/logout`, {
        method: "POST",
        credentials: "include"
    });

    // TODO: gérer erreurs réseau
    return response.json()
};


/**
 * Connecte un utilisateur 
 * @param {Object} userData = données utilisateur {email, password}
 * @returns {Promise<Object>} - résponse JSON de l'API
 */
export const login = async (userData) => {
    const response = await fetch(`${url}/login`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(userData),
        credentials: "include" // inclut les cookies/session
    })

    // TODO: gérer erreurs réseau et invalid login
    return response.json();
}