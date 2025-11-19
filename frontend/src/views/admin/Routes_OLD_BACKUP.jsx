import React, { useState } from 'react';
import { mockRoutes, mockStudents, mockParents } from '../../data/mockData';
import { Users, MapPin, Plus } from 'lucide-react';

export default function Routes() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [routes, setRoutes] = useState(mockRoutes);
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [showStationsModal, setShowStationsModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Mock data trạm
  const mockStations = [
    { id: 1, code: "TR001", name: "Trạm Nguyễn Văn Cừ", address: "Nguyễn Văn Cừ, Quận 5", routeId: "TD001" },
    { id: 2, code: "TR002", name: "Trạm Lê Văn Việt", address: "Lê Văn Việt, Quận 9", routeId: "TD002" },
    { id: 3, code: "TR003", name: "Trạm Nguyễn Thị Minh Khai", address: "Nguyễn Thị Minh Khai, Q1", routeId: "TD001" },
  ];

  // Form data cho thêm/sửa tuyến đường
  const [formData, setFormData] = useState({
    routeId: '',
    name: '',
    startPoint: '',
    endPoint: ''
  });

  // ============================================
  // CRUD FUNCTIONS
  // ============================================
  
  // Thêm hoặc sửa tuyến đường
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingRoute) {
      // Cập nhật tuyến đường
      setRoutes(routes.map(r =>
        r.id === editingRoute.id ? { ...r, ...formData } : r
      ));
    } else {
      // Thêm tuyến đường mới
      const newRoute = {
        id: Math.max(...routes.map(r => r.id)) + 1,
        stops: [],
        studentCount: 0,
        ...formData
      };
      setRoutes([...routes, newRoute]);
    }
    
    // Reset form và đóng modal
    setShowModal(false);
    setEditingRoute(null);
    setFormData({ routeId: '', name: '', startPoint: '', endPoint: '' });
  };

  // Mở modal sửa
  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData(route);
    setShowModal(true);
  };

  // Xóa tuyến đường
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tuyến đường này?')) {
      setRoutes(routes.filter(r => r.id !== id));
    }
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  
  // Lấy danh sách học sinh trên tuyến
  const getStudentsOnRoute = (routeId) => {
    return mockStudents.filter(student => student.routeId === routeId);
  };

  // Lấy danh sách trạm trên tuyến
  const getStationsOnRoute = (routeId) => {
    return mockStations.filter(station => station.routeId === routeId);
  };

  // Lấy thông tin phụ huynh
  const getParentInfo = (parentId) => {
    return mockParents.find(parent => parent.id === parentId);
  };

  // Xem danh sách học sinh
  const handleViewStudents = (route) => {
    setSelectedRoute(route);
    setShowStudentsModal(true);
  };

  // Xem danh sách trạm
  const handleViewStations = (route) => {
    setSelectedRoute(route);
    setShowStationsModal(true);
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý tuyến đường</h1>
          <p className="text-gray-600 mt-1">Danh sách các tuyến đường xe buýt</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Thêm tuyến đường
        </button>
      </div>

      {/* Bảng danh sách tuyến đường */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã tuyến</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên tuyến đường</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Điểm bắt đầu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Điểm kết thúc</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Số trạm</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Số học sinh</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {routes.map((route) => (
              <tr key={route.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{route.routeId}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{route.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{route.startPoint}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{route.endPoint}</td>
                <td className="px-6 py-4 text-sm text-center text-gray-900">
                  {getStationsOnRoute(route.routeId).length}
                </td>
                <td className="px-6 py-4 text-sm text-center text-gray-900">
                  {getStudentsOnRoute(route.routeId).length}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleViewStations(route)}
                      className="text-purple-600 hover:text-purple-900 px-3 py-1 rounded hover:bg-purple-50"
                      title="Xem trạm"
                    >
                      <MapPin size={16} className="inline mr-1" />
                      Trạm
                    </button>
                    <button
                      onClick={() => handleViewStudents(route)}
                      className="text-green-600 hover:text-green-900 px-3 py-1 rounded hover:bg-green-50"
                      title="Xem học sinh"
                    >
                      <Users size={16} className="inline mr-1" />
                      HS
                    </button>
                    <button
                      onClick={() => handleEdit(route)}
                      className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded hover:bg-blue-50"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(route.id)}
                      className="text-red-600 hover:text-red-900 px-3 py-1 rounded hover:bg-red-50"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal thêm/sửa tuyến đường */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingRoute ? 'Sửa tuyến đường' : 'Thêm tuyến đường mới'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Mã tuyến */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã tuyến đường <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.routeId}
                  onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: TD001"
                  required
                />
              </div>

              {/* Tên tuyến */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên tuyến đường <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Tuyến 1 - Quận 1 đến Quận 5"
                  required
                />
              </div>

              {/* Điểm bắt đầu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điểm bắt đầu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.startPoint}
                  onChange={(e) => setFormData({ ...formData, startPoint: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Trường ABC"
                  required
                />
              </div>

              {/* Điểm kết thúc */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điểm kết thúc <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.endPoint}
                  onChange={(e) => setFormData({ ...formData, endPoint: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Khu đô thị XYZ"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingRoute(null);
                    setFormData({ routeId: '', name: '', startPoint: '', endPoint: '' });
                  }}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingRoute ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xem trạm */}
      {showStationsModal && selectedRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Danh sách trạm - {selectedRoute.name}
                </h2>
                <p className="text-gray-600">
                  {getStationsOnRoute(selectedRoute.routeId).length} trạm trên tuyến này
                </p>
              </div>
              <button
                onClick={() => {
                  setShowStationsModal(false);
                  setSelectedRoute(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Danh sách trạm */}
            {getStationsOnRoute(selectedRoute.routeId).length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="mx-auto mb-4 text-gray-400" size={64} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có trạm nào
                </h3>
                <p className="text-gray-600">
                  Thêm trạm trong phần "Quản lý điểm dừng"
                </p>
              </div>
            ) : (
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">STT</th>
                    <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">Mã trạm</th>
                    <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">Tên trạm</th>
                    <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">Địa chỉ</th>
                  </tr>
                </thead>
                <tbody>
                  {getStationsOnRoute(selectedRoute.routeId).map((station, index) => (
                    <tr key={station.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">{station.code}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{station.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{station.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Modal xem học sinh */}
      {showStudentsModal && selectedRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Danh sách học sinh - {selectedRoute.name}
                </h2>
                <p className="text-gray-600">
                  {getStudentsOnRoute(selectedRoute.routeId).length} học sinh trên tuyến này
                </p>
              </div>
              <button
                onClick={() => {
                  setShowStudentsModal(false);
                  setSelectedRoute(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Danh sách học sinh */}
            {getStudentsOnRoute(selectedRoute.routeId).length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto mb-4 text-gray-400" size={64} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có học sinh nào
                </h3>
                <p className="text-gray-600">
                  Thêm học sinh trong phần "Quản lý học sinh"
                </p>
              </div>
            ) : (
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">Mã HS</th>
                    <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">Họ tên</th>
                    <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">Lớp</th>
                    <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">Phụ huynh</th>
                    <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">SĐT</th>
                  </tr>
                </thead>
                <tbody>
                  {getStudentsOnRoute(selectedRoute.routeId).map((student) => {
                    const parent = getParentInfo(student.parentId);
                    return (
                      <tr key={student.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">{student.studentId}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{student.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{student.grade}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{parent?.name || '—'}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{parent?.phone || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
