const url = "http://localhost:3001/api/auth";


export const register  =  async (userData) => {
    const response = await fetch(`${url}/register`, {
        method: "POST",
        header:{"Content-Type": "Application/json"},
        body:JSON.stringify(userData)
    });
    return response.json();
}