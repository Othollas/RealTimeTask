import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MonCompte = ({ user }) =>{

const [group, setGroup] = useState(false);
const [userGroup, setUserGroup] = useState([]); 
const navigate = useNavigate();

useEffect(()=>{
    fetchGroup();
}, [])

const fetchGroup= () => {
    // Fetch pour récuperer les groupe (ou les personnes dans le groupe pour les afficher )


    // si reponse alors json pour recuperer les données des users 

    // si pas de personne catch error
}



if(user){
    return(

    <div>
        <h2>MonCompte</h2>
        
        <p>Personne dans le groupe : </p>
    </div>
)
}else{
    
    {navigate("./moncompte")}

}

};

export default MonCompte;