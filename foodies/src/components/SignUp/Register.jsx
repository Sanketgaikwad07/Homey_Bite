import React, { useState } from 'react'
import './Sign.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { registerUser } from '../../Service/AuthServices';
  



function SignUp() {
  const navigate = useNavigate();

  const[data, setData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onChangeHandler=(event)=>{
    const name=event.target.name;
    const value=event.target.value;

    setData(data=>({ ...data,[name]:value}));
  }

  const onSumbitHandler = async(event)=>{
    event.preventDefault();
try{
  const respone =await registerUser(data);
  if(respone.status==201){
    toast.success('Registrtion coompleted . Please Login');

  }else{
    
toast.error('Unable to register.Please try again..');
  }
}catch(error){
toast.error('Unable to register.Please try again..');

}

    setError('');
    setSuccess('');

    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();
    const password = data.password.trim();

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('homey_users') || '[]');
    const existingUser = storedUsers.find((u) => u.email === email);
    if (existingUser) {
      setError('This email is already registered.');
      return;
    }

    const updatedUsers = [...storedUsers, { name, email, password }];
    localStorage.setItem('homey_users', JSON.stringify(updatedUsers));
    setSuccess('Account created. You can sign in now.');
    navigate('/Login');
  }
  return (
    <div className=" sign-container" >
    <div className="row">
      <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div className="card border-0 shadow rounded-3 my-5">
          <div className="card-body p-4 p-sm-5">
            <h5 className="card-title text-center mb-5 fw-light fs-5">Sign UP</h5>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={onSumbitHandler}>
                 <div className="form-floating mb-3">
                <input type="text" className="form-control" id="floatingName" placeholder="ram"
                
                name="name"
                onChange={onChangeHandler}
                value={data.name}
                required
                
                
                />
                <label htmlFor="floatingName">Full Name</label>
              </div>
              <div className="form-floating mb-3">
                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"
                
                name="email"
                onChange={onChangeHandler}
                  value={data.email}   
                  required             
                />
                <label htmlFor="floatingInput">Email address</label>
              </div>
              <div className="form-floating mb-3">
                <input type="password" className="form-control" id="floatingPassword" placeholder="Password"
                
                name="password"
                onChange={onChangeHandler}
                value={data.password}
                required
                
                />
                <label htmlFor="floatingPassword">Password</label>
              </div>

             
              <div className="d-grid">
                <button className="btn btn-outline-primary btn-login text-uppercase" type="submit">Sign
                  UP</button>
                   <button className="btn btn-outline-danger btn-login text-uppercase mt-2" type="reset">Reset
                  </button>
              </div>
                 
              
              <div className="mt-4">
                Already have  an account? <Link to="/Login">Sign in </Link>

              </div>
             
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default SignUp;
