import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [error, setError] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVerify, setPasswordVerify] = useState('');
    const [email, setEmail] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()

        !username || username === '' ? setError(true) : setError(false);

        const cleanUsername = username.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();

        if (password !== passwordVerify) {
            setError(true);
        }

        const data = { username: cleanUsername, email: cleanEmail, password: cleanPassword };



        if (!error) {

            const response = await register(data);
            setResponseMessage(response.message)
            console.log(response.ok)
            if (response.ok) { setError(''), setUsername(''), setEmail(''), setPassword(''), setPasswordVerify('') }
            setTimeout(() => {
                setResponseMessage('');
                navigate("/", {replace:true});
            }, 2000)
        }
    }

    return (
        <>
            <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <form onSubmit={handleSubmit} >
                    <div className="">
                        <div className="my-5 row">
                            <label htmlFor="username" className="col">username</label>
                            <input className="col" type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>

                        <div className="my-5 row">
                            <label htmlFor="email" className="col">email</label>
                            <input className="col" type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        <div className="my-5 row">
                            <label className="col" htmlFor="password">password</label>
                            <input className="col" type="text" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="my-5 row">
                            <label className="col" htmlFor="passwordVerify">Verification du password</label>
                            <input className="col" type="text" name="passwordVerify" id="passwordVerify" value={passwordVerify} onChange={(e) => setPasswordVerify(e.target.value)} />
                        </div>
                        {error && <div>Tu as une erreur</div>}
                        {responseMessage && <p>{responseMessage}</p>}
                        <button type="submit" className="my-5 btn btn-success" >Envoyer</button>
                    </div>
                </form>
            </div>
        </>
    )
};

export default Register;