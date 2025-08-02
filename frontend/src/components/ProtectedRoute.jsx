import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Protects routes by checking if admin token exists in localStorage.
 * If token is missing, redirects user to the admin login page.
 * Otherwise, renders the protected children components.
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');

  if (!token) {
    // Redirect to admin login if token is not found
    return <Navigate to="/admin" replace />;
  }

  // Token found, allow access to protected content
  return children;
}
