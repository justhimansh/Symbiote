import { useState } from 'react';
import { useHistory } from 'react-router-dom';

export function Register() {
  const history = useHistory();

  const [user, setUser] = useState({
    email: '',
    password: '',
    repassword: ''
  });

  const handleInput = (event) => {
    let name = event.target.name;
    let value = event.target.value;

    setUser({ ...user, [name]: value });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { email, password, repassword } = user;
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          repassword
        })
      });

      if (response.status === 400 || !response) {
        window.alert('Email and Password Used');
      } else {
        window.alert('Registration Successful');
        history.push('/login'); 
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-5 p-5">
        <h1 className="display-6 fw-bolder mb-4">REGISTER</h1>
        <form onSubmit={handleSubmit} method="POST">
          <div className="mb-3">
            <label htmlFor="email">Email Address</label>
            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name='email' value={user.email} onChange={handleInput}/>

          </div>
          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <input type="password" class="form-control" id="exampleInputPassword1" name='password' value={user.password} onChange={handleInput}/>

          </div>
          <div className="mb-3">
            <label htmlFor="repassword">Password again</label>
            <input type="password" class="form-control" id="exampleInputPassword1" name='repassword' value={user.repassword} onChange={handleInput}/>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
