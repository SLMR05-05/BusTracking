import React, { useState } from 'react';
import { mockStudents, mockRoutes, mockParents } from '../../data/mockData';
import { Users, UserCheck, UserX, Plus, Phone, User } from 'lucide-react';

export default function Students() {
  const [students, setStudents] = useState(mockStudents);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    phone: '',
    parentId: '',
    routeId: '',
    stopId: '',
    address: '', // thêm trường địa chỉ
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
    setFormData({
      name: '',
      grade: '',
      phone: '',
      parentId: '',
      routeId: '',
      stopId: '',
      address: '', // reset địa chỉ
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phụ huynh</label>
                <select value={formData.parentId} onChange={e => setFormData({...formData, parentId: parseInt(e.target.value)})} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Chọn phụ huynh</option>
                  {mockParents.filter(p => p.status === 'active').map(parent => (
                    <option key={parent.id} value={parent.id}>
                      {parent.name} - {parent.phone} ({parent.occupation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Điểm đón</label>
                <input type="text" value={formData.stopId} onChange={e => setFormData({...formData, stopId: e.target.value})} placeholder="Nhập tên điểm đón" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>

              

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => { setShowModal(false); setEditingStudent(null); }} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editingStudent ? 'Cập nhật' : 'Thêm mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
