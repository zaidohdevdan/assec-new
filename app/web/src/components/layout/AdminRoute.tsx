import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

// Guard component that ensures the user is authenticated and has role ADMIN
export default function AdminRoute() {
  const { token, user } = useAuthStore((state) => ({ token: state.token, user: state.user }));

  if (!token) {
    // Not logged in – redirect to login/associate area
    return <Navigate to="/area-associado" replace />;
  }

  if (!user || user.role !== 'ADMIN') {
    // Logged in but not admin – redirect to main dashboard or show unauthorized
    return <Navigate to="/dashboard" replace />;
  }

  // User is admin – render nested routes
  return <Outlet />;
}
