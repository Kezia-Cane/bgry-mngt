import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// Remove reportWebVitals if you are not using it
// import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './store'; // Import the configured store

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}> { /* Wrap App with Provider */}
      <Router> { /* Ensure Router wraps App */}
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
);

// reportWebVitals();
