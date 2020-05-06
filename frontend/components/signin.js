import React , {useState, useEffect} from 'react';
import logo from '../images/login-avatar.png';
import { login } from '../fucntions/user_functions'
import '../App.css';    
import { useHistory, Redirect } from "react-router-dom";

function Signin(){
    let history = useHistory();

    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');

    const handleSetEmail = e =>{ setEmail(e.target.value);};
    const handleSetPassword = e =>{ setPassword(e.target.value)};

    let items = [{className:"input-contain",id:"em", type:"email", value: email, design:"form-control mb-4",holder:"Email",change : handleSetEmail},
                {className:"input-contain",id:"pw", type:"password", value: password, design:"form-control mb-4",holder:"Password",change :handleSetPassword}]
    const factory = (className, type,id, value, design, holder, change) => {
        return (
            <div className={className}>
                <input type = {type} id ={id}  value = {value} class = {design} placeholder ={holder} onChange= {change}></input>
            </div>
        )
    };
    function handleFormSubmit (e) {
        e.preventDefault();
        const user = {
            email: email, password: password
        }
        login(user).then(res =>{
            if (res){
                if (res.data.code == 1 || res.data.code == 2|| res.data.code == 3) {
                    window.confirm(res.data.message)
                    localStorage.removeItem('usertoken')
                    history.push('/login')
                } else {
                history.push('home')
                }
            }
    })
};
useEffect(() =>{
    if (localStorage.getItem("usertoken") !== null) {
        history.push('/home')
    } 
});

    

    return (
        <div className = "background">
        <form class="text-center border border-light p-5"  onSubmit = {handleFormSubmit}>
                <p class="h4 mb-4">Sign in</p>
                {items.map(obj =>
                factory(obj.className, obj.type,obj.id, obj.value,
                            obj.design,obj.holder,obj.change))}
                <div className = "input-contain">
                    <button  className="btn btn-lg btn-primary" type="submit">Signin</button>
                </div>
                <p>Not a member? 
                    <a href="/signup"> Register</a>
                        <div className = 'login-img-container'>
                            <img src={logo} alt="logo" />
                        </div>
                </p>
                <p> 
                    <a href="/"> Go to main page</a>
                </p>
                        
        </form>
        </div>
    )
}

export default Signin;