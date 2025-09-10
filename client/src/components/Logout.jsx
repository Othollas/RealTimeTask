import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth"

const Logout = () => {

   const navigate = useNavigate();

   const handleLogout = async (e) => {
      e.preventDefault()

      let data = await logout();

      console.log(data.message)

      if (data) {

         navigate("/login", { replace: true })
      }

   }

   return (
      <button className="btn btn-danger m-5" onClick={handleLogout}>logout </button>
   )
}

export default Logout