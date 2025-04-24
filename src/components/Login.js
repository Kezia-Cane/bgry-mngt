  import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { useNavigate } from 'react-router-dom'; // Import navigation hook
import { clearError, loginUser } from '../store/authSlice'; // Import Redux actions
import Lottie from 'lottie-react';
import loadingAnimation from '../animations/loadingAnimation.json';
import './Login.css';

// Remove onLoginSuccess prop, handle navigation via Redux state
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select relevant state from Redux
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Handle successful authentication with animation
  useEffect(() => {
    if (isAuthenticated && showAnimation) {
      // Wait for 3 seconds before redirecting
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate, showAnimation]);

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
    // Show animation before dispatching login
    setShowAnimation(true);
    // Dispatch the loginUser action with credentials
    dispatch(loginUser({ username, password }));
  };

  return (
    <div className="login-container">
      {showAnimation ? (
        <div className="fullscreen-animation">
          <Lottie
            animationData={loadingAnimation}
            loop={true}
            style={{ width: 300, height: 300 }}
          />
        </div>
      ) : (
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
            <div className="forgot-password">
              <a href="#">Forgot password?</a>
            </div>
            <button type="submit" className="login-button" disabled={isLoading}>
              Get Started
            </button>
            <div className="social-login">
              <p>Or sign in with</p>
              <div className="social-buttons">
                <button type="button" className="social-button google">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="currentColor"/>
                  </svg>
                </button>
                <button type="button" className="social-button facebook">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M20.9,2H3.1A1.1,1.1,0,0,0,2,3.1V20.9A1.1,1.1,0,0,0,3.1,22h9.58V14.25h-2.6v-3h2.6V9a3.64,3.64,0,0,1,3.88-4,20.26,20.26,0,0,1,2.33.12v2.7H17.3c-1.26,0-1.5.6-1.5,1.47v1.93h3l-.39,3H15.8V22h5.1A1.1,1.1,0,0,0,22,20.9V3.1A1.1,1.1,0,0,0,20.9,2Z" fill="currentColor"/>
                  </svg>
                </button>
                <button type="button" className="social-button apple">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M18.71,19.5C17.88,20.74,17,21.95,15.66,21.97C14.32,22,13.89,21.18,12.37,21.18C10.84,21.18,10.37,21.95,9.1,22C7.79,22.05,6.8,20.68,5.96,19.47C4.25,17,2.94,12.45,4.7,9.39C5.57,7.87,7.13,6.91,8.82,6.88C10.1,6.86,11.32,7.75,12.11,7.75C12.89,7.75,14.37,6.68,15.92,6.84C16.57,6.87,18.39,7.1,19.56,8.82C19.47,8.88,17.39,10.1,17.41,12.63C17.44,15.65,20.06,16.66,20.09,16.67C20.06,16.74,19.67,18.11,18.71,19.5ZM13,3.5C13.73,2.67,14.94,2.04,15.94,2C16.07,3.17,15.6,4.35,14.9,5.19C14.21,6.04,13.07,6.7,11.95,6.61C11.8,5.46,12.36,4.26,13,3.5Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Login;
