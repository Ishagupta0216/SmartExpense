import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import styles from './ProtectedRoute.module.css';

function PublicRoute({ children }) {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <span>Loading SmartExpense...</span>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;
