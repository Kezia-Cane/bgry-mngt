import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// Can be enhanced to check for specific roles if needed
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);
  const location = useLocation(); // Get current location

  // Still checking authentication status (e.g., on page refresh)
  // You might want a more sophisticated loading check depending on how initial auth state is loaded
  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // If not authenticated, redirect to login, preserving the intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check roles if allowedRoles are provided
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    // User is authenticated but does not have the required role
    // Redirect to an unauthorized page or back to dashboard/home
    console.warn(`Role-based access denied for route: ${location.pathname}. Required: ${allowedRoles}, User has: ${user.role}`);
    return <Navigate to="/dashboard" replace />; // Or create a specific /unauthorized page
  }

  // If authenticated and authorized (or roles not checked), render the child route component
  return <Outlet />; // Renders the nested route component
};

export default ProtectedRoute;
