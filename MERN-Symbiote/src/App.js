import './App.css';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import About from './Components/About';
import Service from './Components/Service';
import Login from './Components/Login';
import Register from './Components/Register';
import { Route, Switch } from 'react-router-dom';


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

      </Switch>
    </>
  );
}

export default App;