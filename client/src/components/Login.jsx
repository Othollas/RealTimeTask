import { useState } from "react";
import { register } from "../api/auth";

const Login = () => {
    const [error, setError] = useState(false);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault()


        if (email.length < 6) { setError(true) }

        const data = { email: email, password: password };

    
        if (!error) {
            try {
              const result = await  register(data);
              console.log("inscription reussi", result);
            } catch (error) {
                console.error("Erreur :", error.message);
            }
        }

    }

    return (
        <>
            <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <form onSubmit={handleSubmit} >
                    <div className="">

                        <div className="my-5 row">
                            <label htmlFor="email" className="col-4">email</label>
                            <input className="col-8" type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className="my-5 row">
                            <label className="col-4" htmlFor="password">password</label>
                            <input className="col-8" type="text" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        {error && <div>Tu as une erreur</div>}
                        <button type="submit" className="my-5 btn btn-success" >Envoyer</button>
                    </div>
                </form>
            </div>
        </>
    )
};

export default Login;