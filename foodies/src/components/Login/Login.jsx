import React, { useContext, useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../../Service/AuthServices';
import{StoreContext}from '../../context/StoreContext';
import axios from 'axios';
import { buildAuthHeader } from '../../Service/http';

const PENDING_PAYMENT_KEY = 'pending_payment_verification';


function Login() {
  const { setToken, clearCart } = useContext(StoreContext);

  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const clearCartOnServer = async (token) => {
    try {
      await axios.delete('http://localhost:8080/api/cart', {
        headers: buildAuthHeader(token)
      });
    } catch {
      // Ignore cart clear errors after payment verification
    }
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const email = data.email.trim().toLowerCase();
    const password = data.password.trim();

    if (!email || !password) {
      toast.error('Please enter email and password.');
      return;
    }

    try {
      const response = await login({ email, password });

      if (response?.status === 200) {
        const newToken = response.data.token;
        setToken(newToken);
        localStorage.setItem('token', newToken);
        toast.success('Welcome back!');
        const pendingRaw = localStorage.getItem(PENDING_PAYMENT_KEY);
              if (pendingRaw) {
          try {
            const paymentData = JSON.parse(pendingRaw);
            const verifyResponse = await axios.post(
              'http://localhost:8080/api/orders/verify',
              paymentData,
              { headers: buildAuthHeader(newToken) }
            );
            // eslint-disable-next-line no-console
            console.debug('pending-payment verify response:', verifyResponse);
            localStorage.removeItem(PENDING_PAYMENT_KEY);
            const verified = verifyResponse?.data?.success === true || (verifyResponse?.status >= 200 && verifyResponse?.status < 300);
              if (verified) {
            await clearCartOnServer(newToken);
            clearCart();
            try { localStorage.setItem('lastPaymentCleared','1'); } catch {}
            toast.success('Payment verified. Your order is confirmed.');
            navigate('/myorder');
            return;
          }
            toast.error('Payment verification failed. Please contact support.');
          } catch (verifyError) {
            // eslint-disable-next-line no-console
            console.debug('pending-payment verify error:', verifyError?.response?.status, verifyError?.response?.data || verifyError.message);
            localStorage.removeItem(PENDING_PAYMENT_KEY);
            toast.error('Unable to verify payment. Please contact support.');
          }
        }
        navigate('/');
        return;
      }

      toast.error('Login failed. Please try again.');
    } catch (error) {
      const message =
        error?.response?.data?.message || 'Invalid email or password.';
      toast.error(message);
    }
  };

  const onResetHandler = () => {
    setData({ email: '', password: '' });
  };

  return (
     <div className=" login-container" >
    <div className="row">
      <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div className="card border-0 shadow rounded-3 my-5">
          <div className="card-body p-4 p-sm-5">
            <h5 className="card-title text-center mb-5 fw-light fs-5">Sign In</h5>
            <form onSubmit={onSubmitHandler} onReset={onResetHandler}>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  name="email"
                  onChange={onChangeHandler}
                  value={data.email}
                  required
                />
                <label htmlFor="floatingInput">Email address</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  name="password"
                  onChange={onChangeHandler}
                  value={data.password}
                  required
                />
                <label htmlFor="floatingPassword">Password</label>
              </div>

             
              <div className="d-grid">
                <button className="btn btn-outline-primary btn-login text-uppercase" type="submit">Sign
                  in</button>
                   <button className="btn btn-outline-danger btn-login text-uppercase mt-2" type="reset">Reset
                  </button>
              </div>
                 
              
              <div className="mt-4">
                Don't  have  an account? <Link to="/sign">register</Link>

              </div>
             
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Login
