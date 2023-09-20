import React from 'react';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import selfie from "../Files/aboutus.png";

const About = () => {
    
    return (
        <div className="about-background">
            <section id="about">
                <div className="about container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 mt-5">
                            <h3 className='lead text-center fs-5' style={{ color: 'white'}}>About Us</h3>
                            <h1 className="display-6" style={{ color: 'white'}}>Who <b>We</b> Are</h1>
                            <hr/>
                            <p className="fs-6" style={{ color: 'white'}}>Welcome to the Symbiote Project, where a dedicated group of COMP602 students is pioneering advanced artificial intelligence technology for seamless human interaction through voice commands and text. Our team shares a vision of redefining human-AI engagement, committed to creating AI systems that are technologically advanced, user-centric, and adaptable to individual needs while adhering to responsible AI principles. Join us in shaping the future of technology, unlocking AI's full potential as an invaluable companion in our daily lives. Stay tuned for updates on our journey as we collectively influence the path of AI-driven communication. Thank you for being part of the Symbiote Project's exciting venture..</p>
                            <NavLink to="/" className="btn btn-light rounded-pill px-4 py-2">Call Symbiote</NavLink>
                            <NavLink to="/Contact" className="btn btn-light rounded-pill px-4 py-2 ms-2">Contact Us</NavLink>
                            
                        </div>
                        <div className='pic-container'>
                            <img className="pic" src={selfie}></img>
                        </div>
                        
                    </div>
                </div>
            </section>
        </div>
    )
}

export default About;