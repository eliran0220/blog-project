import React , {useState} from 'react';
import { signup } from '../fucntions/user_functions';
import '../App.css';    
import { useHistory } from "react-router-dom";
function Signup(){
    
    let history = useHistory();

    const[first_name, setFirst_Name] = useState('');
    const[last_name, setLast_Name] = useState('');
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[gender, setGender] = useState('')

    const handleGender = e => {setGender(e.target.value);};
    const handleSetFirstName = e =>{ setFirst_Name(e.target.value);};
    const handleSetLastName = e =>{ setLast_Name(e.target.value)};
    const handleSetEmail = e =>{ setEmail(e.target.value);};
    const handleSetPassword = e =>{ setPassword(e.target.value);};

    function handleFormSubmit (e) {
        e.preventDefault();
        const user = {
            first_name: first_name, last_name: last_name, email: email, password: password, gender:gender
        }
        console.log(user.gender)
        signup(user).then(res =>{
            if (res){
                window.confirm(res.data.message)
            } 
        })
    };

    let items = [{className:"input-contain",id:"fn", type:"text", value: first_name, design:"form-control mb-4",holder:"First name",change :handleSetFirstName},
                 {className:"input-contain",id:"ln", type:"text", value: last_name, design:"form-control mb-4",holder:"Last name",change : handleSetLastName},
                 {className:"input-contain",id:"em", type:"email", value: email, design:"form-control mb-4",holder:"Email",change : handleSetEmail},
                 {className:"input-contain",id:"pw", type:"password", value: password, design:"form-control mb-4",holder:"Password",change  :handleSetPassword}]

    const factory = (className, type,id, value, design, holder, change) => {
        return (
            <div className={className}>
                <input type = {type} id ={id}  value = {value} class = {design} placeholder ={holder} onChange= {change}></input>
            </div>
            )
    };
    
    return (
        <div className = "background">
        <form class="text-center  border-light p-5"  onSubmit = {handleFormSubmit}>
            <div className ='create-account'>
                        Create a new account
            </div>
            <div className ='signup-message'>
                The process is fast and easy.
            </div>

            {items.map(obj =>
                factory(obj.className, obj.type,obj.id, obj.value,
                            obj.design,obj.holder,obj.change))}
            <div class="form-group">
                <label for="exampleFormControlSelect1">Select gender: </label>
                <select class="input-contain" id="exampleFormControlSelect1" onChange = {handleGender}>
                    <option value = "Male">Male</option>
                    <option value = "Female">Female</option>
                    <option value = "None">It's a secret!</option>
                </select>
            </div>
            <div className = "input-contain">
                <button  className="btn btn-lg btn-primary" type="submit">Signup</button>
            </div>
            <p>Already a member? 
                <a href="/login"> Signin</a>
            </p>
            <p> 
                <a href="/"> Go to main page</a>
            </p>
        </form>
        </div>
    )

}



export default Signup;