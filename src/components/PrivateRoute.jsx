import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    switch(user.role) {
      case 'admin':
        return <Navigate to="/dashboard" replace />;
      case 'driver':
        return <Navigate to="/driver-dashboard" replace />;
      case 'parent':
        return <Navigate to="/parent-dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default PrivateRoute;