import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../css/auth.css';
import { useAuth } from './AuthContext';

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();  // just set auth state
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    contact: '',
    password: ''
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // allow backend to set cookies if needed
        body: JSON.stringify(signupData)
      });

      const data = await res.json();

      if (res.ok) {
        login();  // no token passed, just update auth state
        navigate('/jobs', { replace: true });
      } else {
        console.error('Signup failed:', data.error || data.message);
        alert(data.error || data.message);
      }
    } catch (err) {
      console.error('Signup fetch error:', err);
      alert('Signup failed. Please try again.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginData)
      });

      const data = await res.json();

      if (res.ok) {
        login();  // no token passed
        navigate('/jobs', { replace: true });
      } else {
        console.error('Login failed:', data.error || data.message);
        alert(data.error || data.message);
      }
    } catch (err) {
      console.error('Login fetch error:', err);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="main funnel-sans-navbar">
      <input type="checkbox" id="chk" aria-hidden="true" />

      <div className="signup">
        <form onSubmit={handleSignup}>
          <label htmlFor="chk" aria-hidden="true">
            <div className='color1'>Sign up</div>
          </label>
          <input
            type="text"
            placeholder="Enter User name"
            required
            value={signupData.username}
            onChange={e => setSignupData({ ...signupData, username: e.target.value })}
          />
          <input
            type="email"
            placeholder="Enter Email"
            required
            value={signupData.email}
            onChange={e => setSignupData({ ...signupData, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Enter Contact Number"
            required
            value={signupData.contact}
            onChange={e => setSignupData({ ...signupData, contact: e.target.value })}
          />
          <input
            type="password"
            placeholder="Enter Password"
            required
            value={signupData.password}
            onChange={e => setSignupData({ ...signupData, password: e.target.value })}
          />
          <button type="submit">Sign up</button>
        </form>
      </div>

      <div className="login">
        <form onSubmit={handleLogin}>
          <label htmlFor="chk" aria-hidden="true">
            <div className='color1'>Login</div>
          </label>
          <input
            type="email"
            placeholder="Enter Email"
            required
            value={loginData.email}
            onChange={e => setLoginData({ ...loginData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Enter Password"
            required
            value={loginData.password}
            onChange={e => setLoginData({ ...loginData, password: e.target.value })}
          />
          <button type="submit">Login</button>
          <button type="button" disabled>Forgot Password</button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
