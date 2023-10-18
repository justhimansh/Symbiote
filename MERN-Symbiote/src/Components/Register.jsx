import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom'

export function Register() {
    // A custom validation function. This must return an object

    // which keys are symmetrical to our values/initialValues
    const history = useHistory();

    const validate = values => {
        const errors = {}

        if (!values.email) {
            errors.email = 'Required'
        } else if (values.email.length < 4) {
            errors.email = 'Must be 5 characters or more'
        }

        if (!values.password) {
            errors.password = 'Required'
        } else if (values.password.length < 8) {
            errors.password = 'Must be 8 characters or more'
        } else if (values.password === '12345678') {
            errors.password = 'Must not be 12345678 !!!'
        }

        if (!values.repassword) {
            errors.repassword = 'Required'
        } else if (values.repassword !== values.password) {
            errors.repassword = 'Second password doesn\'t match'
        }

        return errors
    }
    
    const handleSubmit = async (values) => {
        try {
          const response = await fetch('/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });
  
          if (response.status === 400 || !response) {
              // Registration failed, handle the error
            window.alert('Email and Password Used')
          } else {
            // Registration was successful
            window.alert('Registration Successful');
              history.push('/login')
          }
        } catch (error) {
          console.error('Error:', error);
          // Handle the error, show an error message, etc.
        }
      }

    const formik = useFormik({
        initialValues: {
          email: '',
          password: '',
          repassword: '',
        },
        validate,
        onSubmit : handleSubmit,
      });

    return (
    <div className="row justify-content-center">
        <div className="col-md-5 p-5">
            < h1 className="display-6 fw-bolder mb-4" > REGISTER</h1>
            <form onSubmit={formik.handleSubmit}>
                <div class="mb-3" >
                    <label htmlFor="email">Email Address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className='form-control'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email} />
                    {formik.touched.email && formik.errors.email ? <div className='error'>{formik.errors.email}</div> : null}
                </div>
                <div class="mb-3" >
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        className='form-control'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password} />
                    {formik.touched.password && formik.errors.password ? <div className='error'>{formik.errors.password}</div> : null}
                </div>
                <div class="mb-3" >
                    <label htmlFor="repassword">Password again</label>
                    <input
                        id="repassword"
                        name="repassword"
                        type="password"
                        className='form-control'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.repassword} />
                    {formik.touched.repassword && formik.errors.repassword ? <div className='error'>{formik.errors.repassword}</div> : null}
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
    </div>)
}
export default Register;