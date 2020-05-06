import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"
import Register from "./components/signup.js";
import Home from "./components/home.js";
import Login from "./components/signin.js";
import Default from "./components/default.js";
import Profile from "./components/profile.js";
import Settings from "./components/settings.js";
import ErrorPage from "./components/errorPage.js";
import Follow from './components/follow'
import Followers from './components/followers'


function App() {
  return (
  <Router>
    <Switch>
      <Route exact path='/signup' component={Register} />
      <Route exact path='/home' component={Home} />
      <Route exact path='/login' component={Login} />
      <Route exact path='/' component={Default} />
      <Route exact path='/profile' component={Profile} />
      <Route exact path='/errorPage' component={ErrorPage} />
      <Route exact path='/settings' component={Settings} />
      <Route exact path='/following' component={Follow} />
      <Route exact path='/followers' component={Followers} />

      //TODO : add a like button under each post
      //TODO : fix empty string at search user

    </Switch>
  </Router>
  );
  
}
  


export default App;
