  import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { useNavigate } from 'react-router-dom'; // Import navigation hook
import { clearError, loginUser } from '../store/authSlice'; // Import Redux actions
import LoadingAnimation from './LoadingAnimation';
import './Login.css';

// Remove onLoginSuccess prop, handle navigation via Redux state
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select relevant state from Redux
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Handle successful authentication with animation
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component mounts or unmounts
  useEffect(() => {
    dispatch(clearError());
    return () => {
        dispatch(clearError());
    }
  }, [dispatch]);



  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password) {
        alert('Please enter username and password.');
        return;
    }

    // Dispatch the loginUser action with credentials
    dispatch(loginUser({ username, password }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <img src="/logo.png" alt="Logo" />
        </div>
        <h2>Barangay Management System</h2>
        <p className="login-subtitle">Contact with your Admin about your credentials</p>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <div className="input-icon-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" width="20" height="20">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
              </svg>
              <input
                type="text"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-icon-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" width="20" height="20">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="currentColor"/>
              </svg>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <button type="submit" className="login-button" disabled={isLoading}>
            Login
          </button>
        </form>
        {isLoading && (
          <div className="fullscreen-animation">
            <LoadingAnimation size={150} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
