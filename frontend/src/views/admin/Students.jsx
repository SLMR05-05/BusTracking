import React, { useState } from 'react';
import { mockStudents, mockRoutes, mockParents } from '../../data/mockData';
import { Users, UserCheck, UserX, Plus, Phone, User } from 'lucide-react';

export default function Students() {
  const [students, setStudents] = useState(mockStudents);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [parentSearchTerm, setParentSearchTerm] = useState('');
  const [showParentDropdown, setShowParentDropdown] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    phone: '',
    parentId: '',
    routeId: '',
    stopId: '',
    address: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStudent) {
      setStudents(students.map(s => s.id === editingStudent.id ? { ...s, ...formData } : s ));
    } else {
      const newStudent = { id: Math.max(...students.map(s => s.id)) + 1, ...formData };
      setStudents([...students, newStudent]);
    }
    setShowModal(false);
    setEditingStudent(null);
    setParentSearchTerm('');
    setFormData({
      name: '',
      grade: '',
      phone: '',
      parentId: '',
      routeId: '',
      stopId: '',
      address: '',
    });
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData(student);
    // Set parent search term khi edit
    if (student.parentId) {
      const parent = mockParents.find(p => p.id === student.parentId);
      if (parent) {
        setParentSearchTerm(parent.name);
      }
    }
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học sinh này?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const getParentInfo = (parentId) => {
    if (!parentId) return { name: 'Chưa có', phone: '' };
    const parent = mockParents.find(p => p.id === parentId);
    return parent ? { name: parent.name, phone: parent.phone } : { name: 'Không tìm thấy', phone: '' };
  };

  const getStopInfo = (stopId) => {
    if (!stopId) return 'Chưa chọn';
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

  // Lọc phụ huynh theo từ khóa tìm kiếm
  const filteredParents = mockParents.filter(parent => 
    parent.status === 'active' && (
      parent.name.toLowerCase().includes(parentSearchTerm.toLowerCase()) ||
      parent.phone.includes(parentSearchTerm) ||
      parent.email.toLowerCase().includes(parentSearchTerm.toLowerCase())
    )
  );

  // Xử lý chọn phụ huynh
  const handleSelectParent = (parent) => {
    setFormData({...formData, parentId: parent.id});
    setParentSearchTerm(parent.name);
    setShowParentDropdown(false);
  };

  // Lấy tất cả trạm từ tất cả tuyến
  const getAllStops = () => {
    const allStops = [];
    mockRoutes.forEach(route => {
      if (route.stops) {
        route.stops.forEach(stop => {
          allStops.push({
            ...stop,
            routeName: route.name,
            routeId: route.routeId
          });
        });
      }
    });
    return allStops;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý học sinh</h1>
          <p className="text-gray-600 mt-1">Danh sách và thông tin học sinh</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} /> Thêm học sinh
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Học sinh</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lớp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phụ huynh</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm đón</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map(student => {
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
                          <div className="text-sm text-gray-500">HS000{student.id}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone size={12} /> {student.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.grade}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-green-500" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{parentInfo.name}</div>
                          {parentInfo.phone && (
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone size={12} /> {parentInfo.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getStopInfo(student.stopId)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(student)} className="text-blue-600 hover:text-blue-900">Sửa</button>
                        <button onClick={() => handleDelete(student.id)} className="text-red-600 hover:text-red-900">Xóa</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingStudent ? 'Sửa thông tin học sinh' : 'Thêm học sinh mới'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lớp</label>
                  <input type="text" value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Nhập địa chỉ học sinh" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phụ huynh <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={parentSearchTerm}
                  onChange={(e) => {
                    setParentSearchTerm(e.target.value);
                    setShowParentDropdown(true);
                    if (!e.target.value) {
                      setFormData({...formData, parentId: ''});
                    }
                  }}
                  onFocus={() => setShowParentDropdown(true)}
                  placeholder="Tìm kiếm theo tên, SĐT hoặc email..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required 
                />
                
                {/* Dropdown tìm kiếm phụ huynh */}
                {showParentDropdown && parentSearchTerm && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredParents.length > 0 ? (
                      filteredParents.map(parent => (
                        <div
                          key={parent.id}
                          onClick={() => handleSelectParent(parent)}
                          className={`px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 ${
                            formData.parentId === parent.id ? 'bg-blue-100' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {parent.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{parent.name}</div>
                              <div className="text-sm text-gray-600 flex items-center gap-2">
                                <Phone size={12} /> {parent.phone}
                                <span className="text-gray-400">•</span>
                                <span>{parent.occupation}</span>
                              </div>
                              <div className="text-xs text-gray-500">{parent.email}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500 text-center">
                        Không tìm thấy phụ huynh
                      </div>
                    )}
                  </div>
                )}
                
                {/* Hiển thị phụ huynh đã chọn */}
                {formData.parentId && !showParentDropdown && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <UserCheck size={16} className="text-green-600" />
                      <span className="text-sm text-green-800 font-medium">
                        Đã chọn: {mockParents.find(p => p.id === formData.parentId)?.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tuyến xe <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={formData.routeId} 
                    onChange={e => setFormData({...formData, routeId: e.target.value, stopId: ''})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required
                  >
                    <option value="">Chọn tuyến xe</option>
                    {mockRoutes.filter(r => r.status === 'active').map(route => (
                      <option key={route.routeId} value={route.routeId}>
                        {route.name} ({route.stops?.length || 0} trạm)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạm đón <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={formData.stopId} 
                    onChange={e => setFormData({...formData, stopId: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required
                    disabled={!formData.routeId}
                  >
                    <option value="">
                      {formData.routeId ? 'Chọn trạm đón' : 'Chọn tuyến xe trước'}
                    </option>
                    {getAvailableStops(formData.routeId).map(stop => (
                      <option key={stop.id} value={stop.id}>
                        {stop.name} - {stop.address} ({stop.time})
                      </option>
                    ))}
                  </select>
                  {formData.routeId && getAvailableStops(formData.routeId).length === 0 && (
                    <p className="text-xs text-red-500 mt-1">
                      Tuyến này chưa có trạm nào
                    </p>
                  )}
                </div>
              </div>

              

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => { 
                    setShowModal(false); 
                    setEditingStudent(null); 
                    setParentSearchTerm('');
                    setShowParentDropdown(false);
                  }} 
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
