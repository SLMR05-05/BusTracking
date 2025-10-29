import React, { useState } from 'react';
import { mockStudents, mockBuses, mockRoutes, mockParents } from '../data/mockData';
import { Users, UserCheck, UserX, Plus, Phone, User } from 'lucide-react';

export default function Students() {
  const [students, setStudents] = useState(mockStudents);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    grade: '',
    address: '',
    phone: '',
    parentId: '',
    busId: '',
    routeId: '',
    pickupStopId: '',
    dropoffStopId: '',
    pickupTime: '',
    dropoffTime: '',
    status: 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStudent) {
      // Update existing student
      setStudents(students.map(s => 
        s.id === editingStudent.id 
          ? { ...s, ...formData }
          : s
      ));
    } else {
      // Add new student
      const newStudent = {
        id: Math.max(...students.map(s => s.id)) + 1,
        ...formData
      };
      setStudents([...students, newStudent]);
    }
    setShowModal(false);
    setEditingStudent(null);
    setFormData({
      name: '',
      studentId: '',
      grade: '',
      address: '',
      phone: '',
      parentId: '',
      busId: '',
      routeId: '',
      pickupStopId: '',
      dropoffStopId: '',
      pickupTime: '',
      dropoffTime: '',
      status: 'active'
    });
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData(student);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học sinh này?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const getBusName = (busId) => {
    if (!busId) return 'Chưa phân công';
    const bus = mockBuses.find(b => b.busId === busId);
    return bus ? bus.busId : busId;
  };

  const getRouteName = (routeId) => {
    if (!routeId) return 'Chưa phân công';
    const route = mockRoutes.find(r => r.routeId === routeId);
    return route ? route.name : routeId;
  };

  const getParentInfo = (parentId) => {
    if (!parentId) return { name: 'Chưa có', phone: '' };
    const parent = mockParents.find(p => p.id === parentId);
    return parent ? { name: parent.name, phone: parent.phone } : { name: 'Không tìm thấy', phone: '' };
  };

  const getStopInfo = (stopId) => {
    if (!stopId) return 'Chưa chọn';
    // Tìm điểm dừng trong tất cả các tuyến đường
    for (const route of mockRoutes) {
      const stop = route.stops?.find(s => s.id === stopId);
      if (stop) return stop.name;
    }
    return 'Không tìm thấy';
  };

  const getAvailableStops = (routeId) => {
    if (!routeId) return [];
    const route = mockRoutes.find(r => r.routeId === routeId);
    return route ? route.stops || [] : [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý học sinh</h1>
          <p className="text-gray-600 mt-1">Danh sách và thông tin học sinh sử dụng xe buýt</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Thêm học sinh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Tổng học sinh</div>
              <div className="text-2xl font-bold text-gray-900">{students.length}</div>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              <Users size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Đang hoạt động</div>
              <div className="text-2xl font-bold text-green-600">
                {students.filter(s => s.status === 'active').length}
              </div>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white">
              <UserCheck size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Tạm dừng</div>
              <div className="text-2xl font-bold text-orange-600">
                {students.filter(s => s.status === 'inactive').length}
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white">
              <UserX size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Học sinh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lớp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phụ huynh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Xe buýt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tuyến đường
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điểm dừng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => {
                const parentInfo = getParentInfo(student.parentId);
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.studentId}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone size={12} />
                            {student.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.grade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-2">
                          <User size={14} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{parentInfo.name}</div>
                          {parentInfo.phone && (
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone size={12} />
                              {parentInfo.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getBusName(student.busId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getRouteName(student.routeId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>Lên: {getStopInfo(student.pickupStopId)}</div>
                        <div>Xuống: {getStopInfo(student.dropoffStopId)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>Lên: {student.pickupTime || 'Chưa có'}</div>
                        <div>Xuống: {student.dropoffTime || 'Chưa có'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        student.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {student.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingStudent ? 'Sửa thông tin học sinh' : 'Thêm học sinh mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã học sinh
                  </label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lớp
                  </label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phụ huynh
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({...formData, parentId: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Chọn phụ huynh</option>
                  {mockParents.filter(parent => parent.status === 'active').map(parent => (
                    <option key={parent.id} value={parent.id}>
                      {parent.name} - {parent.phone} ({parent.occupation})
                    </option>
                  ))}
                </select>
                {formData.parentId && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-800">
                      <div className="font-medium">Thông tin phụ huynh:</div>
                      {(() => {
                        const selectedParent = mockParents.find(p => p.id === parseInt(formData.parentId));
                        return selectedParent ? (
                          <div className="mt-1">
                            <div>Tên: {selectedParent.name}</div>
                            <div>SĐT: {selectedParent.phone}</div>
                            <div>Email: {selectedParent.email}</div>
                            <div>Nghề nghiệp: {selectedParent.occupation}</div>
                            <div>Địa chỉ: {selectedParent.address}</div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xe buýt
                  </label>
                  <select
                    value={formData.busId}
                    onChange={(e) => setFormData({...formData, busId: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Chọn xe buýt</option>
                    {mockBuses.filter(bus => bus.status === 'active').map(bus => (
                      <option key={bus.id} value={bus.busId}>
                        {bus.busId} - {bus.licensePlate} (Sức chứa: {bus.capacity})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tuyến đường
                  </label>
                  <select
                    value={formData.routeId}
                    onChange={(e) => {
                      setFormData({
                        ...formData, 
                        routeId: e.target.value,
                        pickupStopId: '', // Reset điểm dừng khi thay đổi tuyến
                        dropoffStopId: ''
                      });
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Chọn tuyến đường</option>
                    {mockRoutes.filter(route => route.status === 'active').map(route => (
                      <option key={route.id} value={route.routeId}>
                        {route.name} - {route.distance} - {route.estimatedTime}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Điểm dừng - chỉ hiển thị khi đã chọn tuyến đường */}
              {formData.routeId && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Điểm dừng lên xe
                    </label>
                    <select
                      value={formData.pickupStopId}
                      onChange={(e) => setFormData({...formData, pickupStopId: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Chọn điểm dừng lên xe</option>
                      {getAvailableStops(formData.routeId).map(stop => (
                        <option key={stop.id} value={stop.id}>
                          {stop.name} - {stop.address} ({stop.time})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Điểm dừng xuống xe
                    </label>
                    <select
                      value={formData.dropoffStopId}
                      onChange={(e) => setFormData({...formData, dropoffStopId: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Chọn điểm dừng xuống xe</option>
                      {getAvailableStops(formData.routeId).map(stop => (
                        <option key={stop.id} value={stop.id}>
                          {stop.name} - {stop.address} ({stop.time})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Hiển thị thông tin điểm dừng đã chọn */}
              {formData.pickupStopId && formData.dropoffStopId && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Thông tin điểm dừng đã chọn:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-blue-800">Điểm lên xe:</div>
                      {(() => {
                        const stop = getAvailableStops(formData.routeId).find(s => s.id === parseInt(formData.pickupStopId));
                        return stop ? (
                          <div className="text-blue-700">
                            <div>{stop.name}</div>
                            <div>{stop.address}</div>
                            <div>Thời gian: {stop.time}</div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                    <div>
                      <div className="font-medium text-blue-800">Điểm xuống xe:</div>
                      {(() => {
                        const stop = getAvailableStops(formData.routeId).find(s => s.id === parseInt(formData.dropoffStopId));
                        return stop ? (
                          <div className="text-blue-700">
                            <div>{stop.name}</div>
                            <div>{stop.address}</div>
                            <div>Thời gian: {stop.time}</div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giờ đón
                  </label>
                  <input
                    type="time"
                    value={formData.pickupTime}
                    onChange={(e) => setFormData({...formData, pickupTime: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giờ trả
                  </label>
                  <input
                    type="time"
                    value={formData.dropoffTime}
                    onChange={(e) => setFormData({...formData, dropoffTime: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    setEditingStudent(null);
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingStudent ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
