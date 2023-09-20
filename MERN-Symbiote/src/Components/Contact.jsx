import React from 'react'

export default function Contact() {
  return (
    <div className="about-background">
            <section id="contact">
                <div className="about container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 mt-5">
                            <h3 className="lead fs-5 text-center" style={{ color: 'white'}}>Contact Us</h3>
                            <h1 className="display-6 text-center mb-4" style={{ color: 'white'}}>Having Question? Get In Touch</h1>\
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            {/* <img src="/Images/Contact.jpg" alt="Contact" className='w-75'/> */}
                        </div>
                    </div>
                    <div className='col-md-6'>
                        <form action=''>
                            <div class="mb-3">
                                <label for="name" class="form-label" style={{ color: 'white'}}>Customer Name</label>
                                <input type="text" class="form-control" id="name" placeholder="Name"/>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label" style={{ color: 'white'}}>Email address</label>
                                <input type="email" class="form-control" id="email" placeholder="name@example.com"/>
                            </div>
                            <div class="mb-3">
                                <label for="message" class="form-label" style={{ color: 'white'}}>Message</label>
                                <textarea class="form-control" id="message" rows="6"></textarea>
                            </div>
                            <button type='sumbit' className='btn btn-light rounded-pill px-4 py-2 ms-2'>Submit<i className='fa fa-mail-forward ms-2'></i></button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
   
  )
}


