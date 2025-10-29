import React, { useState } from 'react';
import { mockDrivers, mockBuses, mockRoutes } from '../data/mockData';
import { Calendar, Clock, Plus, User, Bus, Route, Edit, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Schedule() {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      routeId: 'RT-001',
      routeName: 'Tuyến 1 - Quận 1',
      driverId: 1,
      driverName: 'Trần Văn Tài',
      busId: 'BS-001',
      busPlate: '51A-12345',
      startTime: '06:30',
      endTime: '07:00',
      date: '2024-10-29',
      status: 'active',
      type: 'daily'
    },
    {
      id: 2,
      routeId: 'RT-002',
      routeName: 'Tuyến 2 - Quận 2',
      driverId: 2,
      driverName: 'Nguyễn Văn Hùng',
      busId: 'BS-002',
      busPlate: '51B-67890',
      startTime: '06:45',
      endTime: '07:15',
      date: '2024-10-29',
      status: 'active',
      type: 'daily'
    },
    {
      id: 3,
      routeId: 'RT-003',
      routeName: 'Tuyến 3 - Quận 3',
      driverId: 3,
      driverName: 'Phạm Thị Mai',
      busId: 'BS-003',
      busPlate: '51C-11111',
      startTime: '06:40',
      endTime: '07:10',
      date: '2024-10-29',
      status: 'maintenance',
      type: 'once'
    },
    {
      id: 4,
      routeId: 'RT-001',
      routeName: 'Tuyến 1 - Quận 1',
      driverId: 1,
      driverName: 'Trần Văn Tài',
      busId: 'BS-001',
      busPlate: '51A-12345',
      startTime: '17:00',
      endTime: '17:30',
      date: '2024-10-29',
      status: 'active',
      type: 'daily'
    },
    {
      id: 5,
      routeId: 'RT-002',
      routeName: 'Tuyến 2 - Quận 2',
      driverId: 2,
      driverName: 'Nguyễn Văn Hùng',
      busId: 'BS-002',
      busPlate: '51B-67890',
      startTime: '17:15',
      endTime: '17:45',
      date: '2024-10-29',
      status: 'active',
      type: 'daily'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    routeId: '',
    driverId: '',
    busId: '',
    startTime: '',
    endTime: '',
    date: '',
    status: 'active',
    type: 'daily'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Get additional info for display
    const route = mockRoutes.find(r => r.routeId === formData.routeId);
    const driver = mockDrivers.find(d => d.id === parseInt(formData.driverId));
    const bus = mockBuses.find(b => b.busId === formData.busId);

    if (editingSchedule) {
      setSchedules(schedules.map(s => 
        s.id === editingSchedule.id 
          ? { 
              ...s, 
              ...formData,
              routeName: route?.name || '',
              driverName: driver?.name || '',
              busPlate: bus?.licensePlate || ''
            }
          : s
      ));
    } else {
      const newSchedule = {
        id: Math.max(...schedules.map(s => s.id)) + 1,
        ...formData,
        driverId: parseInt(formData.driverId),
        routeName: route?.name || '',
        driverName: driver?.name || '',
        busPlate: bus?.licensePlate || ''
      };
      setSchedules([...schedules, newSchedule]);
    }
    
    setShowModal(false);
    setEditingSchedule(null);
    resetFormData();
  };

  const resetFormData = () => {
    setFormData({
      routeId: '',
      driverId: '',
      busId: '',
      startTime: '',
      endTime: '',
      date: '',
      status: 'active',
      type: 'daily'
    });
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      routeId: schedule.routeId,
      driverId: schedule.driverId.toString(),
      busId: schedule.busId,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      date: schedule.date,
      status: schedule.status,
      type: schedule.type
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch trình này?')) {
      setSchedules(schedules.filter(s => s.id !== id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'maintenance': return 'Bảo trì';
      case 'cancelled': return 'Hủy';
      default: return 'Không xác định';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} />;
      case 'maintenance': return <AlertTriangle size={16} />;
      case 'cancelled': return <Trash2 size={16} />;
      default: return <Clock size={16} />;
    }
  };

  // Get available drivers (not assigned to other schedules on the same date)
  const getAvailableDrivers = (excludeScheduleId = null) => {
    const assignedDriverIds = schedules
      .filter(s => s.date === formData.date && s.id !== excludeScheduleId)
      .map(s => s.driverId);
    return mockDrivers.filter(d => d.status === 'active' && !assignedDriverIds.includes(d.id));
  };

  // Get available buses (not assigned to other schedules on the same date)
  const getAvailableBuses = (excludeScheduleId = null) => {
    const assignedBusIds = schedules
      .filter(s => s.date === formData.date && s.id !== excludeScheduleId)
      .map(s => s.busId);
    return mockBuses.filter(b => b.status === 'active' && !assignedBusIds.includes(b.busId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lịch trình xe buýt</h1>
          <p className="text-gray-600 mt-1">Phân công tài xế, xe buýt và tuyến đường theo thời gian</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Tạo lịch trình
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Tổng lịch trình</div>
              <div className="text-2xl font-bold text-gray-900">{schedules.length}</div>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              <Calendar size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Đang hoạt động</div>
              <div className="text-2xl font-bold text-green-600">
                {schedules.filter(s => s.status === 'active').length}
              </div>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Bảo trì</div>
              <div className="text-2xl font-bold text-orange-600">
                {schedules.filter(s => s.status === 'maintenance').length}
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Hôm nay</div>
              <div className="text-2xl font-bold text-purple-600">
                {schedules.filter(s => s.date === new Date().toISOString().split('T')[0]).length}
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white">
              <Clock size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tuyến đường
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tài xế
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Xe buýt
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
              {schedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-blue-500" size={16} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(schedule.date).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">{schedule.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Route className="text-green-500" size={16} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{schedule.routeName}</div>
                        <div className="text-xs text-gray-500">{schedule.routeId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                        {schedule.driverName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{schedule.driverName}</div>
                        <div className="text-xs text-gray-500">ID: {schedule.driverId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Bus className="text-purple-500" size={16} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{schedule.busId}</div>
                        <div className="text-xs text-gray-500">{schedule.busPlate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="text-orange-500" size={16} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {schedule.startTime} - {schedule.endTime}
                        </div>
                        <div className="text-xs text-gray-500">
                          {(() => {
                            const start = new Date(`2000-01-01 ${schedule.startTime}`);
                            const end = new Date(`2000-01-01 ${schedule.endTime}`);
                            const diff = (end - start) / (1000 * 60 * 60);
                            return `${diff.toFixed(1)} giờ`;
                          })()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(schedule.status)}`}>
                      {getStatusIcon(schedule.status)}
                      {getStatusText(schedule.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(schedule)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Edit size={14} />
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.id)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingSchedule ? 'Sửa lịch trình' : 'Tạo lịch trình mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại lịch trình
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Hàng ngày</option>
                    <option value="once">1 lần</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tuyến đường
                </label>
                <select
                  value={formData.routeId}
                  onChange={(e) => setFormData({...formData, routeId: e.target.value})}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tài xế
                  </label>
                  <select
                    value={formData.driverId}
                    onChange={(e) => setFormData({...formData, driverId: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Chọn tài xế</option>
                    {getAvailableDrivers(editingSchedule?.id).map(driver => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name} - {driver.driverId} ({driver.experience})
                      </option>
                    ))}
                  </select>
                  {formData.date && getAvailableDrivers(editingSchedule?.id).length === 0 && (
                    <p className="text-xs text-orange-600 mt-1">Không có tài xế khả dụng cho ngày này</p>
                  )}
                </div>
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
                    {getAvailableBuses(editingSchedule?.id).map(bus => (
                      <option key={bus.id} value={bus.busId}>
                        {bus.busId} - {bus.licensePlate} (Sức chứa: {bus.capacity})
                      </option>
                    ))}
                  </select>
                  {formData.date && getAvailableBuses(editingSchedule?.id).length === 0 && (
                    <p className="text-xs text-orange-600 mt-1">Không có xe buýt khả dụng cho ngày này</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giờ bắt đầu
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giờ kết thúc
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Hoạt động</option>
                  <option value="maintenance">Bảo trì</option>
                  <option value="cancelled">Hủy</option>
                </select>
              </div>

              {/* Preview */}
              {formData.routeId && formData.driverId && formData.busId && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Xem trước lịch trình:</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div>Tuyến: {mockRoutes.find(r => r.routeId === formData.routeId)?.name}</div>
                    <div>Tài xế: {mockDrivers.find(d => d.id === parseInt(formData.driverId))?.name}</div>
                    <div>Xe: {mockBuses.find(b => b.busId === formData.busId)?.busId} - {mockBuses.find(b => b.busId === formData.busId)?.licensePlate}</div>
                    <div>Thời gian: {formData.startTime} - {formData.endTime}</div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingSchedule(null);
                    resetFormData();
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingSchedule ? 'Cập nhật' : 'Tạo lịch trình'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}