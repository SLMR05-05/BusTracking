import React, { useState, useEffect } from 'react';
import { mockTracking, mockBuses, mockDrivers, mockRoutes } from '../data/mockData';

export default function Tracking() {
  const [trackingData, setTrackingData] = useState(mockTracking);
  const [selectedBus, setSelectedBus] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setTrackingData(prevData => 
        prevData.map(bus => ({
          ...bus,
          lastUpdate: new Date().toLocaleString('vi-VN')
        }))
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'on_route': return 'bg-green-100 text-green-800';
      case 'picking_up': return 'bg-blue-100 text-blue-800';
      case 'dropping_off': return 'bg-purple-100 text-purple-800';
      case 'delayed': return 'bg-orange-100 text-orange-800';
      case 'stopped': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'on_route': return 'Đang di chuyển';
      case 'picking_up': return 'Đang đón học sinh';
      case 'dropping_off': return 'Đang trả học sinh';
      case 'delayed': return 'Bị chậm';
      case 'stopped': return 'Dừng xe';
      default: return 'Không xác định';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'on_route': return '🚌';
      case 'picking_up': return '👥';
      case 'dropping_off': return '🏫';
      case 'delayed': return '⏰';
      case 'stopped': return '⏸️';
      default: return '❓';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Theo dõi xe buýt</h1>
          <p className="text-gray-600 mt-1">Giám sát vị trí và trạng thái xe buýt theo thời gian thực</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600">Tự động cập nhật</span>
          </label>
          <button
            onClick={() => setTrackingData(mockTracking)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <span>🔄</span>
            Làm mới
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Xe đang hoạt động</div>
              <div className="text-2xl font-bold text-green-600">{trackingData.length}</div>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl">
              ◐
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Đang di chuyển</div>
              <div className="text-2xl font-bold text-blue-600">
                {trackingData.filter(b => b.status === 'on_route').length}
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
              ◑
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Đang đón/trả</div>
              <div className="text-2xl font-bold text-purple-600">
                {trackingData.filter(b => b.status === 'picking_up' || b.status === 'dropping_off').length}
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
              ◒
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Bị chậm</div>
              <div className="text-2xl font-bold text-orange-600">
                {trackingData.filter(b => b.status === 'delayed').length}
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white text-xl">
              ◓
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trackingData.map((bus) => (
          <div key={bus.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{getStatusIcon(bus.status)}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{bus.busId}</h3>
                  <p className="text-sm text-gray-600">{bus.driverName}</p>
                </div>
              </div>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(bus.status)}`}>
                {getStatusText(bus.status)}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tuyến đường:</span>
                <span className="text-sm font-medium text-gray-900">{bus.routeName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Vị trí hiện tại:</span>
                <span className="text-sm font-medium text-gray-900">{bus.currentLocation}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Điểm dừng tiếp theo:</span>
                <span className="text-sm font-medium text-gray-900">{bus.nextStop}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Dự kiến đến:</span>
                <span className="text-sm font-medium text-gray-900">{bus.estimatedArrival}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Học sinh trên xe:</span>
                <span className="text-sm font-medium text-gray-900">{bus.studentsOnBoard} học sinh</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cập nhật lần cuối:</span>
                <span className="text-sm text-gray-500">{bus.lastUpdate}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <button
                onClick={() => setSelectedBus(bus)}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg transition-colors"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedBus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Chi tiết xe {selectedBus.busId}</h2>
              <button
                onClick={() => setSelectedBus(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tài xế</label>
                  <p className="text-sm text-gray-900">{selectedBus.driverName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tuyến đường</label>
                  <p className="text-sm text-gray-900">{selectedBus.routeName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vị trí hiện tại</label>
                  <p className="text-sm text-gray-900">{selectedBus.currentLocation}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Điểm dừng tiếp theo</label>
                  <p className="text-sm text-gray-900">{selectedBus.nextStop}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dự kiến đến</label>
                  <p className="text-sm text-gray-900">{selectedBus.estimatedArrival}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Học sinh trên xe</label>
                  <p className="text-sm text-gray-900">{selectedBus.studentsOnBoard} học sinh</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedBus.status)}`}>
                  {getStatusText(selectedBus.status)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Cập nhật lần cuối</label>
                <p className="text-sm text-gray-900">{selectedBus.lastUpdate}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setSelectedBus(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
