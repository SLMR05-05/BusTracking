import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Parents() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('tracking');

  const tabs = [
    { id: 'tracking', label: 'Theo dõi xe', icon: '📍' },
    { id: 'info', label: 'Thông tin', icon: '👤' },
    { id: 'history', label: 'Lịch sử', icon: '📋' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trang phụ huynh</h1>
          <p className="text-gray-600 mt-1">Theo dõi xe buýt và thông tin học sinh</p>
        </div>
        <div className="text-sm text-gray-500">
          Xin chào, {user?.name}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border p-1">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'tracking' && (
        <div className="space-y-6">
          {/* Bus Status Card */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm opacity-90">Trạng thái xe buýt</div>
                <div className="text-xl font-bold mt-2">Xe BS-001 - Tuyến 1</div>
                <div className="text-sm opacity-90 mt-1">
                  Vị trí: Đang di chuyển trên đường Nguyễn Văn Cừ
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">Tốc độ</div>
                <div className="text-2xl font-bold">35 km/h</div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-sm">Đang di chuyển</span>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
                  📍
                </div>
                <div>
                  <div className="text-sm text-gray-500">Vị trí hiện tại</div>
                  <div className="font-medium text-gray-900">Đường Nguyễn Văn Cừ</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl">
                  ⏰
                </div>
                <div>
                  <div className="text-sm text-gray-500">Cập nhật lúc</div>
                  <div className="font-medium text-gray-900">07:45</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
                  👤
                </div>
                <div>
                  <div className="text-sm text-gray-500">Tài xế</div>
                  <div className="font-medium text-gray-900">Trần Văn Tài</div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-medium">Vị trí xe buýt</h3>
            </div>
            <div className="h-[300px] flex items-center justify-center bg-gray-50">
              <div className="text-gray-400 text-center">
                <div className="text-4xl mb-2">🗺️</div>
                <div>Bản đồ theo dõi xe</div>
                <div className="text-sm mt-1">Tính năng sẽ được tích hợp sau</div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Thông báo</h3>
            <div className="space-y-3">
              <div className="bg-green-50 border-l-4 border-green-300 p-4 rounded">
                <div className="text-sm text-green-700 font-medium">Xe buýt đã đón con</div>
                <div className="text-xs text-gray-600">Con của bạn đã được đón lên xe lúc 06:45</div>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-300 p-4 rounded">
                <div className="text-sm text-blue-700 font-medium">Xe buýt sắp đến</div>
                <div className="text-xs text-gray-600">Xe buýt sẽ đến điểm trong 5 phút</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'info' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Thông tin cá nhân</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Họ và tên</div>
                <div className="font-medium text-gray-900">{user?.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Vai trò</div>
                <div className="font-medium text-gray-900 capitalize">{user?.role}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Thông tin học sinh</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Họ và tên</div>
                    <div className="font-medium text-gray-900">Nguyễn Văn An</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Lớp</div>
                    <div className="font-medium text-gray-900">10A1</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Tuyến xe</div>
                    <div className="font-medium text-gray-900">Tuyến 1</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Mã xe</div>
                    <div className="font-medium text-gray-900">BS-001</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Lịch sử đưa đón</h3>
              <div className="text-sm text-gray-500 mb-4">
                Hiển thị lịch sử đưa đón 7 ngày gần nhất
              </div>
            </div>
            
            <div className="border-t">
              <div className="p-4 border-b hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">Đón học sinh</div>
                    <div className="text-sm text-gray-600 mt-1">Nguyễn Văn An</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">07:15</div>
                    <div className="text-xs text-gray-500">21/01/2024</div>
                  </div>
                </div>
                <div className="mt-3 flex items-start gap-6 text-sm">
                  <div>
                    <div className="text-gray-500">Địa điểm</div>
                    <div className="font-medium">Điểm dừng Nguyễn Văn Cừ</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Xe buýt</div>
                    <div className="font-medium">BS-001</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Tài xế</div>
                    <div className="font-medium">Trần Văn Tài</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-b hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">Trả học sinh</div>
                    <div className="text-sm text-gray-600 mt-1">Nguyễn Văn An</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">16:30</div>
                    <div className="text-xs text-gray-500">21/01/2024</div>
                  </div>
                </div>
                <div className="mt-3 flex items-start gap-6 text-sm">
                  <div>
                    <div className="text-gray-500">Địa điểm</div>
                    <div className="font-medium">Điểm dừng Nguyễn Văn Cừ</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Xe buýt</div>
                    <div className="font-medium">BS-001</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Tài xế</div>
                    <div className="font-medium">Trần Văn Tài</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
