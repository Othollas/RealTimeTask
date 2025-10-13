import { useState } from "react";

const FormGroup = () =>{

const [nameGroup, setNameGroup] = useState('');

const handleSubmit = async (e)=>{
    e.preventDefault()
    console.log(nameGroup)

    try {
       const response = await fetch('http://localhost:3001/api/group', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({nameGroup}),
            credentials: "include"
        });

 const data = await response.json()

        console.log(data)

     
    } catch (error) {
        console.error(error)
    }
}

    return (
        
        <div>
            <label htmlFor="nameGroup">Nom du groupe</label>
            <input type="text" name="nameGroup" id="NameGroup" value={nameGroup} onChange={(e)=>setNameGroup(e.target.value)} />
            <button type="submit" onClick={handleSubmit} >Envoyer</button>
        </div>
        
    )
}

export default FormGroup