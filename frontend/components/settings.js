import '../App.css';    
import { useHistory } from "react-router-dom";
import React , {useEffect,useState} from 'react';
import { saveSettings, upload } from '../fucntions/user_functions'

function Settings() {
    let history = useHistory();
    const[userEmal, setUserEmail] = useState('')
    const[first_name, setFirst_Name] = useState('')
    const[last_name, setLast_Name] = useState('')
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')


    const handleSetFirstName = e =>{ setFirst_Name(e.target.value);};
    const handleSetLastName = e =>{ setLast_Name(e.target.value)};
    const handleSetPassword = e =>{ setPassword(e.target.value);};

    let items = [{className:"input-contain",id:"fn", type:"text", value: first_name, design:"form-control mb-4",holder:"Type new First Name",change :handleSetFirstName},
                 {className:"input-contain",id:"ln", type:"text", value: last_name, design:"form-control mb-4",holder:"Type new Last name",change : handleSetLastName},
                 {className:"input-contain",id:"pw", type:"password", value: password, design:"form-control mb-4",holder:"Type new Password",change  :handleSetPassword}]

    const factory = (className, type,id, value, design, holder, change) => {
        return (
            <div className={className}>
                <input type = {type} id ={id}  value = {value} class = {design} placeholder ={holder} onChange= {change}></input>
            </div>
            )
    };




      function changeSettings (e) {
        e.preventDefault();
        const emailOfUser = localStorage.getItem('useremail')
        const settings = {
            first_name: first_name, last_name: last_name, password: password, originEmail : emailOfUser
        }
        saveSettings(settings).then(res =>{
            if (res.data.code == 0){
                window.confirm(res.data.message)
                history.push('/login')
                localStorage.removeItem('usertoken')
            } else {
                window.confirm(res.data.message)
            }
        })
        
    };
    useEffect(() =>{
        if (localStorage.getItem("usertoken") == null) {
            history.push('/errorPage')
        }
        const originEmail = localStorage.getItem('useremail')
        setUserEmail(originEmail)
    });

    return (
        <div className = "background">
            <div className = "wrapper-settings-background">
            <div className = "wrapper-settings" >
            <form class="text-center  border-light p-5"  onSubmit = {changeSettings}>
                    {items.map(obj =>
                    factory(obj.className, obj.type,obj.id, obj.value,
                            obj.design,obj.holder,obj.change))}
                    <div className = "input-contain">
                        <button  className="btn btn-lg btn-primary" type="submit">Save</button>
                    </div>
                    <p> 
                        <a href="/home"> Go back to your home page. </a>
                    </p>
                    
                </form>
          </div>
          </div>
        </div>
    )
    
}
export default Settings