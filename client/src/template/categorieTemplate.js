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