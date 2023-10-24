import React from 'react';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';

const Navbar = (props) => {
    return (
        <div>
            <nav class="navbar navbar-expand-lg navbar-light shadow">
            <div class="container-fluid">
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                  <li class="nav-item">
                    <NavLink className="nav-link active" aria-current="page" to="/">Home</NavLink>
                  </li>
                  <li class="nav-item">
                    <NavLink className="nav-link" to="/about">About</NavLink>
                  </li>
                  <li class="nav-item">
                    <NavLink className="nav-link" to="/service">Service</NavLink>
                  </li>
                  <li class="nav-item">
                    <NavLink className="nav-link" to="/contact">Contact</NavLink>
                  </li>
                  <li class="nav-item">
                    <NavLink className="nav-link" to="/chatbot">Chat Bot</NavLink>
                  </li>
                  <li class="nav-item">
                    <NavLink className="nav-link" to="/video">Video</NavLink>
                  </li>
                  <li class="nav-item">
                    <NavLink className="nav-link" to="/games">Games</NavLink>
                  </li>
                </ul>

                <NavLink className="navbar-brand fw-bolder fs-4 mx-auto"to="/">Symbiote</NavLink>
                
                {props.auth ?
                <>
                  <NavLink to="/login" className="btn btn-light ms-auto px-4 rounded-pill"><i className="fa fa-sign-in me-2"></i>Login</NavLink>
                  <NavLink to="/register" className="btn btn-light ms-2 px-4 rounded-pill"><i className="fa fa-user-plus me-2"></i>Sign Up</NavLink>
                  </>
                  :
                  <>
                  <NavLink to="/logout" className="btn btn-light ms-2 px-4 rounded-pill"><i className="fa fa-sign-out me-2"></i>Logut</NavLink>
                  </>
}
              </div>
            </div>
          </nav>
        </div>
    );
}

export default Navbar;