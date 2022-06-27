import {useState} from 'react';
import Axios from 'axios';
import "./Login.css";
import Loader from "../../loader/Loader";
import { Link, useNavigate } from 'react-router-dom';

function UserLogin(){
    const [userLoginValues,setUserLoginValues]=useState({
        userName:'',
        password:''
    })
    const loginUrl=process.env.REACT_APP_DIARY_LOGIN;
    const navigate=useNavigate();
    const [misMatchErr,setMisMatchErr]=useState(true);
    const handleChange=({target:{name,value}})=>{
        setMisMatchErr(true);
        setUserLoginValues(prevState=>({...prevState,[name]:value}))
    }
    const [loginErr,setLoginErr]=useState("Username & Password Doesn't Match");
    const [isLoading,setIsLoading]=useState(true);
    const handleSubmit =(event)=>{
        if(userLoginValues.userName!==''&& userLoginValues.password!=='')
        {
            setIsLoading(false);
        event.preventDefault();
            // Axios request to Login into the user Account
            Axios.post(loginUrl,{
                userName:userLoginValues.userName,
                password:userLoginValues.password}).then((response)=>{
                    setIsLoading(true);
                    const token=response.data.token;
                    const userId=response.data.userId;
                    const name=response.data.name;
                    localStorage.setItem('token',token);
                    localStorage.setItem('userId',userId);
                    localStorage.setItem('name',name);
                    setUserLoginValues({userName:"",password:""});
                    if(response.status===200){
                        navigate("/events/view");
                    }
                }).catch((err)=>{
                    setIsLoading(true);
                    if(err.response.status===400){
                        setLoginErr("User Doesn't Exits");
                        setMisMatchErr(false);
                    }
                    if(err.response.status===403){
                        setLoginErr("Username & Password Doesn't Match");
                        setMisMatchErr(false);
                    }
            })
        }
        else{
            setLoginErr("Please Fill details");
            setMisMatchErr(false);
        }
    };
    return(
        <>
        <div className='loginOuterContainer'>
            <div className='loginInnerContainer'>
                <h1 className='login-label'>Diary Manager</h1>
                    <h4 className='login-label'>Username</h4>
                        <input 
                            name="userName"
                            type="text"
                            placeholder='Username'
                            value={userLoginValues.userName}
                            className='login-editbox'
                            onChange={handleChange}/>
                        <h4 className='login-label'>Password</h4>
                        <input 
                            name="password"
                            type="password"
                            value={userLoginValues.password}
                            className='login-editbox'
                            placeholder='Password'
                            onChange={handleChange}/>
                        <button className='login-button' onClick={handleSubmit}>Login</button>
                        <div className='loader-login' disabled={isLoading}>
                            <Loader/>
                        </div>
                        <h4 className='login-label-err'disabled={misMatchErr}>{loginErr}</h4>
                        <Link to="/user/register"> <h4 className='employee-login-label'>New User? Register</h4></Link>
            </div>
        </div>
        </>
    )
}

export default UserLogin;