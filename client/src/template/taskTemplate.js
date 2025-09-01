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
},{
    _id: generateId(),
    title: "Nettoyer le salon",
    description: null,
    category_id: id,
    completed: false,
    created_at: Date.now(),
    updated_at: Date.now(),
    recovery_time: null,
    point: null
},{
    _id: generateId(),
    title: "Nettoyer la chambre",
    description: null,
    category_id: id,
    completed: false,
    created_at: Date.now(),
    updated_at: Date.now(),
    recovery_time: null,
    point: null
},{
    _id: generateId(),
    title: "Nettoyer la salle de bain",
    description: null,
    category_id: id,
    completed: false,
    created_at: Date.now(),
    updated_at: Date.now(),
    recovery_time: null,
    point: null
},{
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