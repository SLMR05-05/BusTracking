import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Check, AlertCircle, Calendar, Clock, Filter } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/parent-notifications';

export default function NotificationHistory() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  const authHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/parent/${user?.parentId}`, authHeader);
      setNotifications(res.data);
    } catch (err) {
      console.error('Lỗi tải thông báo:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`${API_BASE_URL}/${notificationId}/read`, {}, authHeader);
      setNotifications(prev =>
        prev.map(n => n.MaTB === notificationId ? { ...n, DaDoc: '1' } : n)
      );
    } catch (err) {
      console.error('Lỗi đánh dấu đã đọc:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${API_BASE_URL}/parent/${user?.parentId}/read-all`, {}, authHeader);
      setNotifications(prev => prev.map(n => ({ ...n, DaDoc: '1' })));
    } catch (err) {
      console.error('Lỗi đánh dấu tất cả:', err);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return notif.DaDoc === '0';
    if (filter === 'read') return notif.DaDoc === '1';
    return true;
  });

  const unreadCount = notifications.filter(n => n.DaDoc === '0').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông báo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-lg p-6 shadow border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Bell className="text-blue-600" size={28} />
                Lịch sử thông báo
              </h1>
              <p className="text-gray-600 mt-1">
                {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Tất cả thông báo đã đọc'}
              </p>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Check size={18} />
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg p-4 shadow border">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Lọc:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tất cả ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'unread'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Chưa đọc ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'read'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Đã đọc ({notifications.length - unreadCount})
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow border">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Bell size={64} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">
                {filter === 'unread' ? 'Không có thông báo chưa đọc' : 
                 filter === 'read' ? 'Không có thông báo đã đọc' : 
                 'Chưa có thông báo nào'}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notif) => (
                <div
                  key={notif.MaTB}
                  className={`p-5 hover:bg-gray-50 transition-colors ${
                    notif.DaDoc === '0' ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-full flex-shrink-0 ${
                      notif.LoaiThongBao === 'attendance' 
                        ? 'bg-green-100' 
                        : notif.LoaiThongBao === 'stop_passed_success'
                        ? 'bg-green-100'
                        : notif.LoaiThongBao === 'stop_passed_missed'
                        ? 'bg-red-100'
                        : 'bg-orange-100'
                    }`}>
                      {notif.LoaiThongBao === 'attendance' || notif.LoaiThongBao === 'stop_passed_success' ? (
                        <Check size={20} className="text-green-600" />
                      ) : (
                        <AlertCircle size={20} className={
                          notif.LoaiThongBao === 'stop_passed_missed' ? 'text-red-600' : 'text-orange-600'
                        } />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <p className={`text-gray-800 ${notif.DaDoc === '0' ? 'font-semibold' : ''}`}>
                        {notif.NoiDung}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>
                            {new Date(notif.ThoiGianFormatted || notif.ThoiGian).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>
                            {new Date(notif.ThoiGianFormatted || notif.ThoiGian).toLocaleTimeString('vi-VN')}
                          </span>
                        </div>
                        {notif.TenHS && (
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                            {notif.TenHS}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Mark as read button */}
                    {notif.DaDoc === '0' && (
                      <button
                        onClick={() => markAsRead(notif.MaTB)}
                        className="flex-shrink-0 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Đánh dấu đã đọc"
                      >
                        <Check size={20} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
