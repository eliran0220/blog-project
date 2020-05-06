import React from 'react';
import {Navbar,NavbarBrand,Nav} from 'reactstrap';
import '../App.css';    
import logo from '../images/home-avatar.png';
import {useEffect} from 'react';
import { useHistory } from "react-router-dom";

function Default() {
    let history = useHistory();
    useEffect(() =>{
        console.log(localStorage.getItem("usertoken"))
        if (localStorage.getItem("usertoken") !== null) {
            history.push('/home')
        }
},[]);

    return (
        <div className = "box">
            <div className = "Navbar">
                <Navbar color="light" light expand="md">
                    <Nav>
                        <NavbarBrand href="/login">Login</NavbarBrand>
                        <NavbarBrand href="/signup">Signup</NavbarBrand>
                    </Nav>
                </Navbar>
            
                <div className = 'avatar-about'>
                    <img src={logo} alt="logo" />
                </div>
            </div>
            <div className = "card" class = "card border-light mb-3 card-default" >
                <div class="mdl-card__title">
                    <h2 class="mdl-card__title-text">Welcome!</h2>
                    </div>
                        <div class="mdl-card__supporting-text">
                            Welcome to inTouch! Signup today and check up on your friends.
                            You can create your own blog and reflect on your life.
                            Be sure to check on your friends also :)
                    </div>
            </div>
                   
            </div>
                
    )

}

export default Default;