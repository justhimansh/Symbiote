import React, { useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const Login = () => {

   const history = useHistory()
    const [user, setUser] = useState({
        email : '',
        password : ''
    });

    const handleChange = (event) =>{
        let name = event.target.name
        let value = event.target.value

        setUser({...user, [name] : value})
    }

    const handleSubmit = async (event) =>{
        event.preventDefault();
        const {email, password} = user;
        try {
            const res = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email, password
                })
            });

            if (res.status === 400 || !res) {
              window.alert('Wrong Email or Password, Please try again')
            } else {
              window.alert('Login Successful');
                window.location.reload();
                history.push('/')
            }
          } catch (error) {
            console.error('Error:', error);
          }
    }

    return(
        <div className="row justify-content-center">
            <div className="col-md-5 p-5">
                <form onSubmit={handleSubmit}>
                    <h1 className="display-6 fw-bolder mb-4">LOGIN</h1>
                    <div class="mb-3">
                        <label for="exampleInputEmail1" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name='email' value={user.email} onChange={handleChange}/>
                    </div>
                    <div class="mb-3">
                        <label for="exampleInputPassword1" class="form-label">Password</label>
                        <input type="password" class="form-control" id="exampleInputPassword1" name='password' value={user.password} onChange={handleChange}/>
                    </div>
                    <div class="mb-3 form-check">
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default Login;