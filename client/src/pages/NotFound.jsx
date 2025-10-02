/**
 * Composant NotFound
 * 
 * Rôle :
 * Permet d'afficher un ecran d'erreur si la route n'est pas trouver 
 *
 */

const NotFound = ()=>{
    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 ">
            <h1 className="mb-5">404</h1>
            <h2 className="mb-5">NOT FOUND</h2>
            <h4>We are sorry but your data is in another castle</h4>
        </div>
    )
}

export default NotFound;