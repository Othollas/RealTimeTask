const generateId = () => {
    return Date.now().toString(36) + Math.random().toString().substring(2, 9)
}

// const generateId = () => {
//     return crypto.randomUUID(); // Génère des UUID v4 vraiment uniques
// }


export default generateId;

