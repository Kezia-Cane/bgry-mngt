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
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Login</h2>
          {/* Display error message from Redux state */}
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <button type="submit" className="login-button" disabled={isLoading}>
            Log In
          </button>
        </form>
      )}
    </div>
  );
}

export default Login;
