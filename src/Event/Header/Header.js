
import "./Header.css"
import {Link, useNavigate} from "react-router-dom"

function Header(){
    const navigate=useNavigate();
    const signout=()=>{
        localStorage.clear();
        navigate("/user/login");
    } 
    return(
        <>
        <div className="header">
            <div className="div-icon"><span className="icon"> SR </span></div>
            <h1 className="header-admin-label">Diary</h1>
            <div className="options">
                <button className="sign-out-button" onClick={signout}>Log out</button>
            </div>
        </div>
        </>
    )
}


export default Header;