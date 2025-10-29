import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  BarChart3,
  Users,
  User,
  Bus,
  MapPin,
  Navigation,
  UserCheck,
  Settings,
  LogOut,
  Calendar,
  Clock
} from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const adminNav = [
    { key: 'overview', label: 'Tổng quan', icon: BarChart3, path: '/dashboard' },
    { key: 'students', label: 'Học sinh', icon: Users, path: '/students' },
    { key: 'drivers', label: 'Tài xế', icon: User, path: '/drivers' },
    { key: 'buses', label: 'Xe buýt', icon: Bus, path: '/buses' },
    { key: 'routes', label: 'Tuyến đường', icon: MapPin, path: '/routes' },
    { key: 'schedule', label: 'Lịch trình', icon: Calendar, path: '/schedule' },
    { key: 'tracking', label: 'Theo dõi', icon: Navigation, path: '/tracking' },
    { key: 'parents', label: 'Phụ huynh', icon: UserCheck, path: '/parents' },
    { key: 'settings', label: 'Cài đặt', icon: Settings, path: '/settings' },
  ];

  const driverNav = [
    { key: 'overview', label: 'Tổng quan', icon: BarChart3, path: '/driver-dashboard' },
    { key: 'tracking', label: 'Theo dõi xe', icon: Navigation, path: '/driver-tracking' },
    { key: 'schedule', label: 'Lịch trình', icon: MapPin, path: '/driver-schedule' },
  ];

  const parentNav = [
    { key: 'overview', label: 'Tổng quan', icon: BarChart3, path: '/parent-dashboard' },
    { key: 'tracking', label: 'Theo dõi xe', icon: Navigation, path: '/parent-tracking' },
    { key: 'history', label: 'Lịch sử', icon: Clock, path: '/parent-history' },
  ];

  const getNavItems = () => {
    switch (user?.role) {
      case 'admin': return adminNav;
      case 'driver': return driverNav;
      case 'parent': return parentNav;
      default: return adminNav;
    }
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-72 bg-white h-screen border-r fixed flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center gap-3 border-b">
        <div className="text-2xl">🚌</div>
        <div className="font-bold text-lg">BusManager</div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="font-medium text-gray-900">{user?.name}</div>
            <div className="text-sm text-gray-500 capitalize">{user?.role}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1">
        <div className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const IconComponent = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors select-none ${active
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <IconComponent size={20} />
                <div className="font-medium">{item.label}</div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <div className="font-medium">Đăng xuất</div>
        </button>
      </div>
    </aside>
  );
}
