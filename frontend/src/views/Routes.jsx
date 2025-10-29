import React, { useState } from 'react';
import { mockRoutes, mockBuses, mockStudents, mockParents } from '../data/mockData';
import { Users, Eye, MapPin, Plus, User, Phone, Trash2 } from 'lucide-react';

export default function Routes() {
  const [routes, setRoutes] = useState(mockRoutes);
  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showStopsModal, setShowStopsModal] = useState(false);
  const [editingStops, setEditingStops] = useState([]);
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
      address: '',
      time: ''
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
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
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
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              <MapPin size={24} />
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
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white">
              <Eye size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Tổng học sinh</div>
              <div className="text-2xl font-bold text-purple-600">
                {routes.reduce((total, route) => total + getStudentsOnRoute(route.routeId).length, 0)}
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white">
              <Users size={24} />
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
                <Users className="mx-auto mb-4 text-gray-400" size={64} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có học sinh nào
                </h3>
                <p className="text-gray-600">
                  Tuyến đường này chưa có học sinh nào được phân công.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {getStudentsOnRoute(selectedRoute.routeId).map((student) => {
                  const parent = getParentInfo(student.parentId);
                  return (
                    <div key={student.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{student.name}</h4>
                            <div className="text-sm text-gray-600">
                              {student.grade} • {student.studentId}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone size={12} />
                              {student.phone}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Điểm dừng & Thời gian</div>
                          <div className="text-sm font-medium text-gray-900">
                            Lên: {(() => {
                              const stop = selectedRoute.stops?.find(s => s.id === student.pickupStopId);
                              return stop ? `${stop.name} (${student.pickupTime || stop.time})` : 'Chưa có';
                            })()}
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            Xuống: {(() => {
                              const stop = selectedRoute.stops?.find(s => s.id === student.dropoffStopId);
                              return stop ? `${stop.name} (${student.dropoffTime || stop.time})` : 'Chưa có';
                            })()}
                          </div>
                        </div>
                      </div>
                      
                      {parent && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-2">
                            <User className="text-green-600" size={16} />
                            <div className="text-sm">
                              <span className="font-medium text-gray-900">Phụ huynh: </span>
                              <span className="text-gray-700">{parent.name}</span>
                              <span className="text-gray-500 ml-2">• {parent.phone}</span>
                              <span className="text-gray-500 ml-2">• {parent.occupation}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Địa chỉ: </span>
                          {student.address}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Xe buýt: </span>
                          {student.busId || 'Chưa phân công'}
                        </div>
                        <div className="text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            student.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {student.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 mt-6 border-t">
              <button
                onClick={() => {
                  setShowStudentsModal(false);
                  setSelectedRoute(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

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
                editingStops.map((stop, index) => (
                  <div key={stop.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên điểm dừng
                          </label>
                          <input
                            type="text"
                            value={stop.name}
                            onChange={(e) => handleUpdateStop(stop.id, 'name', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập tên điểm dừng"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Địa chỉ
                          </label>
                          <input
                            type="text"
                            value={stop.address}
                            onChange={(e) => handleUpdateStop(stop.id, 'address', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập địa chỉ"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Thời gian
                          </label>
                          <input
                            type="time"
                            value={stop.time}
                            onChange={(e) => handleUpdateStop(stop.id, 'time', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                ))
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
