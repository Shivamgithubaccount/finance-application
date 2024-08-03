import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../graphql/mutations';
import { useNavigate } from 'react-router-dom';
import './styles/SignIn.css';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginUser] = useMutation(LOGIN_USER);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await loginUser({ variables: { username, password } });
      localStorage.setItem('token', data.loginUser.token);
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <div className="avatar">
          <span className="avatar-icon">A</span>
        </div>
        <h1 className="title">Sign In</h1>
        <form onSubmit={handleSubmit} className="signin-form">
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
          <button type="submit" className="submit-button">Sign In</button>
        </form>
        <div className="signup-link">
          <a href="/signup">Create an account? Sign Up</a>
        </div>
        <footer className="copyright">
          <p>copyright © <a href="https://mui.com/">Finance</a> {new Date().getFullYear()}.</p>
        </footer>
      </div>
    </div>
  );
}