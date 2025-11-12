import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  // Chờ khi đang load dữ liệu
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>⏳ Đang kiểm tra...</div>;
  }

  // Không có user → chuyển đến login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra role có được phép không
  if (allowedRoles && !allowedRoles.includes(user.role)) {
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