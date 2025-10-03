/**
 * Template de tâches par défaut
 * 
 * Rôle global :
 *  - Fournir un tableau de tâches “pré-remplies” pour une catégorie donnée
 *  - Chaque tâche est associée à une catégorie via category_id et contient un identifiant unique, un titre, une description optionnelle, un statut de complétion, des timestamps et des champs supplémentaires pour la gestion (recovery_time, point)
 *  - Permet d’initialiser la base locale (localStorage) ou d’avoir un état par défaut pour les utilisateurs non connectés
 * 
 * Structure d’un objet tâche :
 *  - _id           : identifiant unique généré par generateId()
 *  - title         : titre de la tâche
 *  - description   : description optionnelle (null si non renseignée)
 *  - category_id   : identifiant de la catégorie associée
 *  - completed     : booléen indiquant si la tâche est terminée
 *  - created_at    : timestamp de création
 *  - updated_at    : timestamp de dernière mise à jour
 *  - recovery_time : valeur optionnelle pour gestion future (ex: temps de récupération)
 *  - point         : valeur optionnelle pour gestion future (ex: points de tâche)
 * 
 * Usage typique :
 *  import taskTemplate from "../template/taskTemplate";
 *  const tasks = taskTemplate(categoryId);
 *  localStorage.setItem("defaultTasks", JSON.stringify(tasks));
 */

import generateId from "../function";

const taskTemplate = (id) => [
    {
        _id: generateId(),
        title: "Nettoyer l'entrée",
        description: null,
        category_id: id,
        completed: false,
        created_at: Date.now(),
        updated_at: Date.now(),
        recovery_time: null,
        point: null
    },
    {
        _id: generateId(),
        title: "Nettoyer la cuisine",
        description: null,
        category_id: id,
        completed: false,
        created_at: Date.now(),
        updated_at: Date.now(),
        recovery_time: null,
        point: null
    }, {
        _id: generateId(),
        title: "Nettoyer le salon",
        description: null,
        category_id: id,
        completed: false,
        created_at: Date.now(),
        updated_at: Date.now(),
        recovery_time: null,
        point: null
    }, {
        _id: generateId(),
        title: "Nettoyer la chambre",
        description: null,
        category_id: id,
        completed: false,
        created_at: Date.now(),
        updated_at: Date.now(),
        recovery_time: null,
        point: null
    }, {
        _id: generateId(),
        title: "Nettoyer la salle de bain",
        description: null,
        category_id: id,
        completed: false,
        created_at: Date.now(),
        updated_at: Date.now(),
        recovery_time: null,
        point: null
    }, {
        _id: generateId(),
        title: "Nettoyer les toilettes",
        description: null,
        category_id: id,
        completed: false,
        created_at: Date.now(),
        updated_at: Date.now(),
        recovery_time: null,
        point: null
    }
]

export default taskTemplate;