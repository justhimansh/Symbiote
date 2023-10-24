import './App.css';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import About from './Components/About';
import Service from './Components/Service';
import Login from './Components/Login';
import Register from './Components/Register';
import { Route, Switch } from 'react-router-dom';
import Contact from './Components/Contact';
import Chatbot from './Components/Chatbot';
import Video from './Components/Video'
import Games from './Components/Games'
import Logout from './Components/Logout';
import Protectedroute from './Components/Protectedroute';
import { useEffect, useState } from 'react';

function App() {
  const [auth, setauth] = useState(false);
  const [auth1,setauth1] = useState(true);

  const isLoggedIn = async () => {
    try{
      const response = await fetch('/auth', {
        method : "GET",
        headers : {
          Accept : "application/json",
          "Content-Type" : "application/json"
        },
        credentials : "include"
      });

      if (response.status === 200){
        setauth(true)
        setauth1(false)
      }
      if (response.status === 401){
        setauth(false)
        setauth1(true)
      }
    }catch (error){
      console.log(error)
    }
  }

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <>
      <Navbar auth = {auth1}/>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route eaxct path='/about' component={About}/>
        <Route exact path='/service' component={Service}/>
        <Protectedroute exact path='/login' component={Login} auth={auth1}/>
        <Protectedroute exact path='/register' component={Register} auth={auth1}/>
        <Route exact path='/contact' component={Contact}/>
        <Route exact path='/chatbot' component={Chatbot}/>
        <Route exact path='/video' component={Video}/>
        <Route exact path='/games' component={Games}/>
        <Protectedroute exact path='/logout' component={Logout} auth={auth}/>
      </Switch>
    </>
  );
}

export default App;