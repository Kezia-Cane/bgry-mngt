import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearError, loginUser } from '../store/authSlice';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard'); // Or your main authenticated route
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component mounts or unmounts
  useEffect(() => {
    dispatch(clearError());
    return () => {
        dispatch(clearError());
    }
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      // Basic client-side validation
      alert('Please enter username and password');
      return;
    }
    dispatch(loginUser({ username, password }));
  };

  return (
    <div style={styles.container}> { /* Basic Styling */}
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="username" style={styles.label}>Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            disabled={isLoading}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            disabled={isLoading}
          />
        </div>
        {error && <p style={styles.errorText}>{error}</p>}
        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {/* Optional: Link to registration page */}
      {/* <p>Don't have an account? <Link to="/register">Register here</Link></p> */}
    </div>
  );
}

// Basic inline styles (consider using CSS Modules or a UI library)
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    formGroup: {
        marginBottom: '15px',
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '5px',
        fontWeight: 'bold'
    },
    input: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '3px',
        fontSize: '1rem'
    },
    button: {
        padding: '10px 15px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'background-color 0.2s ease'
    },
    errorText: {
        color: 'red',
        marginBottom: '10px',
        textAlign: 'center'
    }
};

export default LoginPage;
