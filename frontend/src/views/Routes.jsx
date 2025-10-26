import React, { useState } from 'react';
import { mockRoutes, mockBuses } from '../data/mockData';

export default function Routes() {
  const [routes, setRoutes] = useState(mockRoutes);
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [formData, setFormData] = useState({
    routeId: '',
    name: '',
    startPoint: '',
    endPoint: '',
    distance: '',
    estimatedTime: '',
    status: 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRoute) {
      setRoutes(routes.map(r => 
        r.id === editingRoute.id 
          ? { ...r, ...formData }
          : r
      ));
    } else {
      const newRoute = {
        id: Math.max(...routes.map(r => r.id)) + 1,
        stops: [],
        busCount: 0,
        studentCount: 0,
        ...formData
      };
      setRoutes([...routes, newRoute]);
    }
    setShowModal(false);
    setEditingRoute(null);
    setFormData({
      routeId: '',
      name: '',
      startPoint: '',
      endPoint: '',
      distance: '',
      estimatedTime: '',
      status: 'active'
    });
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData(route);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tuyến đường này?')) {
      setRoutes(routes.filter(r => r.id !== id));
    }
  };

  const getBusCount = (routeId) => {
    return mockBuses.filter(bus => bus.routeId === routeId).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý tuyến đường</h1>
          <p className="text-gray-600 mt-1">Danh sách và thông tin các tuyến đường xe buýt</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <span>🗺️</span>
          Thêm tuyến đường
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Tổng tuyến đường</div>
              <div className="text-2xl font-bold text-gray-900">{routes.length}</div>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
              🗺️
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Đang hoạt động</div>
              <div className="text-2xl font-bold text-green-600">
                {routes.filter(r => r.status === 'active').length}
              </div>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white text-xl">
              ✅
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Tổng xe phục vụ</div>
              <div className="text-2xl font-bold text-purple-600">
                {routes.reduce((total, route) => total + getBusCount(route.routeId), 0)}
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
              🚌
            </div>
          </div>
        </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {routes.map((route) => (
          <div key={route.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{route.name}</h3>
                <p className="text-sm text-gray-600">{route.routeId}</p>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                route.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {route.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Điểm bắt đầu:</span>
                <span className="text-sm font-medium text-gray-900">{route.startPoint}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Điểm kết thúc:</span>
                <span className="text-sm font-medium text-gray-900">{route.endPoint}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Khoảng cách:</span>
                <span className="text-sm font-medium text-gray-900">{route.distance}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Thời gian ước tính:</span>
                <span className="text-sm font-medium text-gray-900">{route.estimatedTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Số xe phục vụ:</span>
                <span className="text-sm font-medium text-gray-900">{getBusCount(route.routeId)} xe</span>
              </div>
            </div>

            <div className="pt-4 border-t flex gap-2">
              <button
                onClick={() => handleEdit(route)}
                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg transition-colors"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(route.id)}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-2 px-4 rounded-lg transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingRoute ? 'Sửa thông tin tuyến đường' : 'Thêm tuyến đường mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã tuyến đường
                  </label>
                  <input
                    type="text"
                    value={formData.routeId}
                    onChange={(e) => setFormData({...formData, routeId: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên tuyến đường
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điểm bắt đầu
                </label>
                <input
                  type="text"
                  value={formData.startPoint}
                  onChange={(e) => setFormData({...formData, startPoint: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điểm kết thúc
                </label>
                <input
                  type="text"
                  value={formData.endPoint}
                  onChange={(e) => setFormData({...formData, endPoint: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Khoảng cách
                  </label>
                  <input
                    type="text"
                    value={formData.distance}
                    onChange={(e) => setFormData({...formData, distance: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời gian ước tính
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedTime}
                    onChange={(e) => setFormData({...formData, estimatedTime: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Tạm dừng</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingRoute(null);
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  {editingRoute ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
