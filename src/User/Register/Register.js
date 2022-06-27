import {useState} from 'react';
import Axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "./Register.css";
import Loader from '../../loader/Loader';

function  UserRegister(){
    const [userRegisterValues,setUserRegisterValues]=useState({
        name:'',
        userName:'',
        password:''
    })
    const registerUrl=process.env.REACT_APP_DIARY_REGISTER;
    const navigate=useNavigate();
    const [created,setCreated]=useState(true);
    const [alreadyExists,setAlreadyExists]=useState(true);
    const handleChange=({target:{name,value}})=>{
        setAlreadyExists(true);
        setCreated(true);
        setUserRegisterValues(prevState=>({...prevState,[name]:value}))
    }
    const [loginErr,setLoginErr]=useState("Username Already Registered");
    const [isLoading,setIsLoading]=useState(true);
    const handleSubmit =(event)=>{
        if(userRegisterValues.name!=='' && userRegisterValues.password!=='' && userRegisterValues.userName!=='')
        {
        event.preventDefault();
            // Axios request to Login into the user Account
            Axios.post(registerUrl,{
                name:userRegisterValues.name,
                userName:userRegisterValues.userName,
                password:userRegisterValues.password}).then((response)=>{
                    const token=response.data.token;
                    localStorage.setItem('token',token);
                    setUserRegisterValues({name:"",userName:"",password:""});
                    if(response.status===200){
                        setCreated(false);
                    }
                    setTimeout(()=>{
                        navigate("/user/login");
                    },1500)
                }).catch((err)=>{
                    if(err.response.status===400){
                        setLoginErr("Username Already Registered");
                        setAlreadyExists(false);
                    }
            })
        }
        else{
            setLoginErr("Please Fill details");
            setAlreadyExists(false);
        }
    };
    return(
        <>
        <div className='loginOuterContainer'>
            <div className='registerInnerContainer'>
                <h1 className='login-label'>Diary Manager</h1>
                <h4 className='login-label'>Name</h4>
                <input 
                            name="name"
                            type="text"
                            placeholder='Name'
                            value={userRegisterValues.name}
                            className='login-editbox'
                            onChange={handleChange}/>
                    <h4 className='login-label'>Username</h4>
                        <input 
                            name="userName"
                            type="text"
                            placeholder='Username'
                            value={userRegisterValues.userName}
                            className='login-editbox'
                            onChange={handleChange}/>
                        <h4 className='login-label'>Password</h4>
                        <input 
                            name="password"
                            type="password"
                            value={userRegisterValues.password}
                            className='login-editbox'
                            placeholder='Password'
                            onChange={handleChange}/>
                        <button className='login-button' onClick={handleSubmit}>Register</button>
                        <div className='loader-login' disabled={isLoading}>
                            <Loader/>
                        </div>
                        <h4 className='login-label-err'disabled={alreadyExists}>{loginErr}</h4>
                        <h4 className='login-label-succ'disabled={created}>Account Created</h4>
                        <Link to="/user/login"> <h4 className='employee-login-label'>Old User? Login</h4></Link>
            </div>
        </div>
        </>
    )
}

export default UserRegister;