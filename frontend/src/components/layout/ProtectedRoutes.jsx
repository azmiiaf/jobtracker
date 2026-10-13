import { Navigate, Outlet } from 'react-router-dom';
import { isTokenExpired } from '../../services/authService';

export default function ProtectedRoute() {
  const token = localStorage.getItem('token');
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login?expired=true" replace />;
  }
  return <Outlet />;
}