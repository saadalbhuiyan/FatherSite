// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');

  // If no token, redirect to admin login
  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  // Otherwise render children components (protected page)
  return children;
}
