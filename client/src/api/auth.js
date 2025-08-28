const url = "http://localhost:3001/api/auth";


export const register  =  async (userData) => {
    const response = await fetch(`${url}/register`, {
        method: "POST",
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify(userData)
    });

    
    return response.json();
}