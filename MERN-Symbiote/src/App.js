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

function App() {
  return (
    <>
      <Navbar/>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route eaxct path='/about' component={About}/>
        <Route exact path='/service' component={Service}/>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/register' component={Register}/>
        <Route exact path='/contact' component={Contact}/>
        <Route exact path='/chatbot' component={Chatbot}/>
        <Route exact path='/video' component={Video}/>
        <Route exact path='/games' component={Games}/>
      </Switch>
    </>
  );
}

export default App;