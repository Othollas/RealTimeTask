const generateId = () => {
    return Date.now().toString(36) + Math.random().toString().substring(2,9)
}

export default generateId;