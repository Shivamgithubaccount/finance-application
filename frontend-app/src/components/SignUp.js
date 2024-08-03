import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER_USER } from '../graphql/mutations';
import { useNavigate } from 'react-router-dom';
import './styles/SignUp.css';

function Copyright() {
  return (
    <footer className="copyright">
      <p>Sharif © <a href="https://mui.com/">Finance</a> {new Date().getFullYear()}.</p>
    </footer>
  );
}

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerUser] = useMutation(REGISTER_USER);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await registerUser({ variables: { username, password } });
      if (data) {
        console.log("Registration successful", data);
        localStorage.setItem('token', data.registerUser.token);
        navigate('/signin');
      } else {
        console.error("Registration failed, no data returned");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="avatar">
          <span className="avatar-icon">A</span>
        </div>
        <h1 className="title">Sign Up</h1>
        <form onSubmit={handleSubmit} className="signup-form">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="submit-button">Sign Up</button>
          <div className="signin-link">
            <a href="/signin">Already have an account? Sign In</a>
          </div>
        </form>
        <Copyright />
      </div>
    </div>
  );
}