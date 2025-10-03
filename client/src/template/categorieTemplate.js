/**
 * Template de catégories par défaut
 * 
 * Rôle global :
 *  - Fournir un tableau de catégories “pré-remplies” pour une application qui gère des catégories (ex : cuisine, chambre…)
 *  - Chaque objet catégorie contient un identifiant unique, un nom, une description optionnelle, un propriétaire et des timestamps de création et mise à jour
 *  - Permet d’initialiser la base locale (localStorage) ou d’avoir un état par défaut pour les utilisateurs non connectés
 * 
 * Structure d’un objet catégorie :
 *  - _id        : identifiant unique généré par generateId()
 *  - name       : nom de la catégorie
 *  - description: description optionnelle (null si non renseignée)
 *  - owner      : identifiant du propriétaire (null si aucune information)
 *  - created_at : timestamp de création
 *  - updated_at : timestamp de dernière mise à jour
 * 
 * Usage typique :
 *  import categorieTemplate from "../template/categorieTemplate";
 *  localStorage.setItem("defaultCategorie", JSON.stringify(categorieTemplate));
 */

import generateId from "../function";

const categorieTemplate = [
    {
        _id: generateId(),
        name: "Entrée",
        description: null,
        owner: null,
        created_at: Date.now(),
        updated_at: Date.now()
    },
        {
        _id: generateId(),
        name: "Cuisine",
        description: null,
        owner: null,
        created_at: Date.now(),
        updated_at: Date.now()
    },    {
        _id: generateId(),
        name: "Salon",
        description: null,
        owner: null,
        created_at: Date.now(),
        updated_at: Date.now()
    },    {
        _id: generateId(),
        name: "Chambre",
        description: null,
        owner: null,
        created_at: Date.now(),
        updated_at: Date.now()
    },    {
        _id: generateId(),
        name: "SDB",
        description: null,
        owner: null,
        created_at: Date.now(),
        updated_at: Date.now()
    },    {
        _id: generateId(),
        name: "Toilettes",
        description: null,
        owner: null,
        created_at: Date.now(),
        updated_at: Date.now()
    }
]


export default categorieTemplate;