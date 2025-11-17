import React, { useState } from 'react';
import { mockRoutes, mockBuses, mockStudents, mockParents } from '../../data/mockData';
import { Users, Eye, MapPin, Plus, User, Phone, Trash2 } from 'lucide-react';

export default function Routes() {
  const [routes, setRoutes] = useState(mockRoutes);
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showStopsModal, setShowStopsModal] = useState(false);
  const [editingStops, setEditingStops] = useState([]);

  const mockStopsList = [
  { id: 1, name: "Trạm 1 - Nguyễn Văn Cừ", address: "123 Nguyễn Văn Cừ, Q.5" },
  { id: 2, name: "Trạm 2 - Lê Lợi", address: "45 Lê Lợi, Q.1" },
  { id: 3, name: "Trạm 3 - Võ Thị Sáu", address: "89 Võ Thị Sáu, Q.3" },
  { id: 4, name: "Trạm 4 - Phan Đăng Lưu", address: "67 Phan Đăng Lưu, Q.Phú Nhuận" },
  { id: 5, name: "Trạm 5 - Hoàng Hoa Thám", address: "200 Hoàng Hoa Thám, Q.Tân Bình" },
];



  const [formData, setFormData] = useState({
    routeId: '',
    name: '',
    startPoint: '',
    endPoint: ''
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
      endPoint: ''
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

  const getStudentsOnRoute = (routeId) => {
    return mockStudents.filter(student => student.routeId === routeId);
  };

  const getParentInfo = (parentId) => {
    return mockParents.find(parent => parent.id === parentId);
  };

  const handleViewStudents = (route) => {
    setSelectedRoute(route);
    setShowStudentsModal(true);
  };

  const handleViewStops = (route) => {
    setSelectedRoute(route);
    setEditingStops([...route.stops]);
    setShowStopsModal(true);
  };

  const handleAddStop = () => {
    const newStop = {
      id: Math.max(...editingStops.map(s => s.id), 0) + 1,
      name: '',
      address: ''
    };
    setEditingStops([...editingStops, newStop]);
  };

  const handleUpdateStop = (stopId, field, value) => {
    setEditingStops(editingStops.map(stop =>
      stop.id === stopId ? { ...stop, [field]: value } : stop
    ));
  };

  const handleDeleteStop = (stopId) => {
    setEditingStops(editingStops.filter(stop => stop.id !== stopId));
  };

  const handleSaveStops = () => {
    setRoutes(routes.map(route =>
      route.id === selectedRoute.id
        ? { ...route, stops: editingStops }
        : route
    ));
    setShowStopsModal(false);
    setSelectedRoute(null);
    setEditingStops([]);
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Thêm tuyến đường
        </button>
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
                <span className="text-sm text-gray-600">Số học sinh:</span>
                <span className="text-sm font-medium text-gray-900">{getStudentsOnRoute(route.routeId).length} học sinh</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Điểm dừng:</span>
                <span className="text-sm font-medium text-gray-900">{route.stops?.length || 0} điểm</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex gap-2 mb-2">
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
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => handleViewStops(route)}
                  className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <MapPin size={16} />
                  Điểm dừng ({route.stops?.length || 0})
                </button>
                <button
                  onClick={() => handleViewStudents(route)}
                  className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Users size={16} />
                  Học sinh ({getStudentsOnRoute(route.routeId).length})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Bus Stops Modal */}
      {showStopsModal && selectedRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Quản lý điểm dừng - {selectedRoute.name}
                </h2>
                <p className="text-gray-600">
                  {editingStops.length} điểm dừng trên tuyến này
                </p>
              </div>
              <button
                onClick={() => {
                  setShowStopsModal(false);
                  setSelectedRoute(null);
                  setEditingStops([]);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {editingStops.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="mx-auto mb-4 text-gray-400" size={64} />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chưa có điểm dừng nào
                  </h3>
                  <p className="text-gray-600">
                    Thêm điểm dừng đầu tiên cho tuyến đường này.
                  </p>
                </div>
              ) : (
                editingStops.map((stop, index) => {
                  const stopData = mockStopsList.find(s => s.id === stop.stopId);
                  return (
                    <div key={stop.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tên điểm dừng
                            </label>
                            <select
                              value={stop.stopId || ""}
                              onChange={(e) => {
                                const id = parseInt(e.target.value);
                                const selected = mockStopsList.find(s => s.id === id);
                                handleUpdateStop(stop.id, "stopId", id);
                                handleUpdateStop(stop.id, "name", selected?.name || "");
                                handleUpdateStop(stop.id, "address", selected?.address || "");
                              }}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">-- Chọn điểm dừng --</option>
                              {mockStopsList.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Địa chỉ
                            </label>
                            <input
                              type="text"
                              value={stop.address || ""}
                              disabled
                              className="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 text-gray-700"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteStop(stop.id)}
                          className="text-red-600 hover:text-red-800 p-2"
                          title="Xóa điểm dừng"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <button
                onClick={handleAddStop}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus size={16} />
                Thêm điểm dừng
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowStopsModal(false);
                    setSelectedRoute(null);
                    setEditingStops([]);
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveStops}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


           



      {/* Students Modal */}
      {showStudentsModal && selectedRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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

            {getStudentsOnRoute(selectedRoute.routeId).length === 0 ? (
              <div className="text-center py-12">
                <User className="mx-auto mb-4 text-gray-400" size={64} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có học sinh nào trên tuyến này
                </h3>
                <p className="text-gray-600">
                  Bạn có thể thêm học sinh trong phần “Quản lý học sinh”.
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
                    <th className="text-left px-4 py-2 text-sm font-medium text-gray-700">Địa chỉ</th>
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
                        <td className="px-4 py-2 text-sm text-gray-900">{student.address}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )} 
      {/* Add/Edit Route Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingRoute ? 'Sửa thông tin tuyến đường' : 'Thêm tuyến đường mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã tuyến đường</label>
                  <input
                    type="text"
                    value={formData.routeId}
                    onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên tuyến đường</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Điểm bắt đầu</label>
                <select
                  value={formData.startPoint}
                  onChange={(e) => {
                    const selectedId = parseInt(e.target.value);
                    const selectedStop = mockStopsList.find(s => s.id === selectedId);
                    setFormData({
                      ...formData,
                      startPoint: selectedStop?.name || "",
                    });
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Chọn điểm bắt đầu --</option>
                  {mockStopsList.map((stop) => (
                    <option key={stop.id} value={stop.id}>{stop.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Điểm kết thúc</label>
                <select
                  value={formData.endPoint}
                  onChange={(e) => {
                    const selectedId = parseInt(e.target.value);
                    const selectedStop = mockStopsList.find(s => s.id === selectedId);
                    setFormData({
                      ...formData,
                      endPoint: selectedStop?.name || "",
                    });
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Chọn điểm kết thúc --</option>
                  {mockStopsList.map((stop) => (
                    <option key={stop.id} value={stop.id}>{stop.name}</option>
                  ))}
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
