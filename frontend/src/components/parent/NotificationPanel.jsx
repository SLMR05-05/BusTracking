import React, { useState, useEffect } from 'react';
import { Bell, Check, AlertCircle, X } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE_URL = 'http://localhost:5000/api/parent-notifications';
const SOCKET_URL = 'http://localhost:5000';

export default function NotificationPanel({ parentId, token }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const authHeader = {
    headers: { Authorization: `Bearer ${token || localStorage.getItem('token')}` }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/parent/${parentId}`, authHeader);
      setNotifications(res.data);
      
      const unreadRes = await axios.get(`${API_BASE_URL}/parent/${parentId}/unread-count`, authHeader);
      setUnreadCount(unreadRes.data.count);
    } catch (err) {
      console.error('Lỗi tải thông báo:', err);
    } finally {
      setLoading(false);
    }
  };

  // Socket.IO realtime
  useEffect(() => {
    if (!parentId) return;

    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('🔌 Connected to socket');
      socket.emit('join-parent-room', parentId);
    });

    socket.on('attendance-update', (notification) => {
      console.log('📢 Nhận thông báo mới:', notification);
      
      // Thêm vào đầu danh sách
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Hiển thị browser notification
      if (Notification.permission === 'granted') {
        new Notification('Thông báo đón trả', {
          body: notification.NoiDung,
          icon: '/vite.svg'
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [parentId]);

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Load notifications on mount
  useEffect(() => {
    if (parentId) {
      fetchNotifications();
    }
  }, [parentId]);

  // Mark as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`${API_BASE_URL}/${notificationId}/read`, {}, authHeader);
      setNotifications(prev =>
        prev.map(n => n.MaTB === notificationId ? { ...n, DaDoc: '1' } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Lỗi đánh dấu đã đọc:', err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await axios.put(`${API_BASE_URL}/parent/${parentId}/read-all`, {}, authHeader);
      setNotifications(prev => prev.map(n => ({ ...n, DaDoc: '1' })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Lỗi đánh dấu tất cả:', err);
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell size={24} className="text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-blue-50 rounded-t-xl">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Bell size={20} className="text-blue-600" />
              Thông báo ({unreadCount} chưa đọc)
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Đánh dấu tất cả
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Đang tải...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Bell size={48} className="mx-auto mb-2 opacity-30" />
                <p>Chưa có thông báo nào</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.MaTB}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    notif.DaDoc === '0' ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      notif.LoaiThongBao === 'attendance' 
                        ? 'bg-green-100' 
                        : notif.LoaiThongBao === 'stop_passed_success'
                        ? 'bg-green-100'
                        : notif.LoaiThongBao === 'stop_passed_missed'
                        ? 'bg-red-100'
                        : 'bg-orange-100'
                    }`}>
                      {notif.LoaiThongBao === 'attendance' || notif.LoaiThongBao === 'stop_passed_success' ? (
                        <Check size={16} className="text-green-600" />
                      ) : (
                        <AlertCircle size={16} className={
                          notif.LoaiThongBao === 'stop_passed_missed' ? 'text-red-600' : 'text-orange-600'
                        } />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{notif.NoiDung}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notif.ThoiGianFormatted || notif.ThoiGian).toLocaleString('vi-VN')}
                      </p>
                    </div>

                    {notif.DaDoc === '0' && (
                      <button
                        onClick={() => markAsRead(notif.MaTB)}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                      >
                        <Check size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
