import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type { RootState } from '../../store';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const bypassAuth = import.meta.env.VITE_E2E_BYPASS_AUTH === 'true';

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  if (!user && !bypassAuth) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
