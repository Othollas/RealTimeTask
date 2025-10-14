import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FormGroup = ({fetchGroup}) => {

    const [nameGroup, setNameGroup] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        

        try {
            const response = await fetch('http://localhost:3001/api/group', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nameGroup }),
                credentials: "include"
            });

            const data = await response.json()

            if(data.validate){
                setNameGroup('');
                fetchGroup();
                navigate("/moncompte", { replace: true });

            }

        } catch (error) {
            console.error(error)
        }
    }

    return (

        <div>
            <label htmlFor="nameGroup">Nom du groupe</label>
            <input type="text" name="nameGroup" id="NameGroup" value={nameGroup} onChange={(e) => setNameGroup(e.target.value)} />
            <button type="submit" onClick={handleSubmit} >Envoyer</button>
        </div>

    )
}

export default FormGroup