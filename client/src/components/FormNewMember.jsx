import { useState } from "react";


const FormNewMember = ({setError}) => {

    const [nameMember, setNameMember] = useState('')
    

    const handleSubmit = async (e) => {
        e.preventDefault()
        
if(nameMember.length > 3) {
        try {
            const response = await fetch('http://localhost:3001/api/group/member', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({nameMember}),
                credentials: "include"
            });

            const data = await response.json()

            console.log(data.result)

        } catch (error) {
            console.error(error)
        }
} else {
    setError({error : "Vous devez entrer un nom > 3 caracteres"})
}

    }

    return (

        <div>
            <label htmlFor="nameGroup">Nom du nouveau membre</label>
            <input type="text" name="nameMember" id="nameMember" value={nameMember} onChange={(e) => setNameMember(e.target.value)} />
            <button type="submit" onClick={handleSubmit} >ajouter</button>
        </div>

    )
}

export default FormNewMember