// frontend/src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Usage examples:
// <ProtectedRoute> → requires any logged-in user
// <ProtectedRoute role="admin"> → requires admin role
const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  // Not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // Logged in but wrong role → redirect to home
  if (role && user.role !== role) return <Navigate to="/" replace />;

  // Authorized → render children
  return children;
};

export default ProtectedRoute;