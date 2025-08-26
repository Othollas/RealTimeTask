import { useState } from "react";

const Login = () => {
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e)=>{
        e.preventDefault()

        const req =JSON.stringify({username : username, password: password});
        console.log(req)
    }



    return (
        <>
            <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <form onSubmit={handleSubmit} >
                    <div className="">
                        <div className="my-5">
                            <label htmlFor="username">username</label>
                            <input type="text" name="username" id="username" value={username} onChange={(e)=>setUsername(e.target.value)} />
                        </div>

                        <div className="my-5">
                            <label htmlFor="password">password</label>
                            <input type="text" name="password" id="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                        </div>

                         <button type="submit" className="my-5 btn btn-success" >Envoyer</button>
                    </div>
                </form>
            </div>
        </>
    )
};

export default Login;