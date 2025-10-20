import { useState } from "react";


const FormNewMember = ({setError, objectGroup, fetchGroup}) => {

    const [nameMember, setNameMember] = useState('')
    

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const idGroup = objectGroup._id

        const nameMemberSubmit = nameMember;

if(nameMember.length > 3) {
        try {
            const response = await fetch('http://localhost:3001/api/group/member', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({nameMemberSubmit, idGroup}),
                credentials: "include"
            });

            const data = await response.json()
            
            
            if(data.result){
                fetchGroup()
            }

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