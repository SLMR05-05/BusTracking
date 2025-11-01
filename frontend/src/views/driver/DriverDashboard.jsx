import React, { useState, useEffect } from 'react';
import { mockStudents, mockTracking } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, Users, MapPin, AlertTriangle, CheckCircle, MessageSquare, Navigation } from 'lucide-react';

export default function DriverDashboard() {
  const { user } = useAuth();
  const [currentBus, setCurrentBus] = useState(null);
  const [studentsToPickup, setStudentsToPickup] = useState([]);
  const [checkedStudents, setCheckedStudents] = useState(new Set());
  const [incidents, setIncidents] = useState([]);
  const [showIncidentForm, setShowIncidentForm] = useState(false);

  useEffect(() => {
    // Simulate finding driver's bus and students
    const driverBus = mockTracking.find(bus => bus.driverName.includes(user?.name?.split(' ')[0] || 'Trần'));
    setCurrentBus(driverBus || mockTracking[0]);
    
    // Get students for this route
    const routeStudents = mockStudents.filter(student => 
      student.busId === (driverBus?.busId || 'BS-001') && student.status === 'active'
    );
    setStudentsToPickup(routeStudents);
  }, [user]);

  const handleStudentCheck = (studentId, action) => {
    const newChecked = new Set(checkedStudents);
    if (action === 'pickup') {
      newChecked.add(`${studentId}-pickup`);
    } else if (action === 'dropoff') {
      newChecked.add(`${studentId}-dropoff`);
    }
    setCheckedStudents(newChecked);
    
    // Simulate notification
    const student = studentsToPickup.find(s => s.id === studentId);
    alert(`Đã xác nhận ${action === 'pickup' ? 'đón' : 'trả'} học sinh ${student?.name}`);
  };

  const handleIncidentReport = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const incident = {
      id: Date.now(),
      type: formData.get('type'),
      description: formData.get('description'),
      time: new Date().toLocaleString('vi-VN'),
      status: 'Đã báo cáo'
    };
    setIncidents([incident, ...incidents]);
    setShowIncidentForm(false);
    alert('Đã gửi báo cáo sự cố thành công!');
    e.target.reset();
  };

  if (!currentBus) {
    return <div className="p-6">Đang tải thông tin...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Chào mừng, {user?.name || 'Tài xế'}!</h1>
            <p className="text-blue-100 mt-1">Lịch làm việc hôm nay - {new Date().toLocaleDateString('vi-VN')}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{currentBus.busId}</div>
            <div className="text-blue-100">{currentBus.routeName}</div>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Vị trí hiện tại</div>
              <div className="text-lg font-bold text-gray-900">{currentBus.currentLocation}</div>
            </div>
            <MapPin className="text-blue-500" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Điểm tiếp theo</div>
              <div className="text-lg font-bold text-gray-900">{currentBus.nextStop}</div>
            </div>
            <Navigation className="text-green-500" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Học sinh trên xe</div>
              <div className="text-lg font-bold text-gray-900">{currentBus.studentsOnBoard}</div>
            </div>
            <Users className="text-purple-500" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Dự kiến đến</div>
              <div className="text-lg font-bold text-gray-900">{currentBus.estimatedArrival}</div>
            </div>
            <Clock className="text-orange-500" size={32} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student List */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Users className="text-blue-600" size={24} />
              Danh sách học sinh ({studentsToPickup.length})
            </h2>
            <p className="text-gray-600 text-sm mt-1">Điểm danh học sinh lên/xuống xe</p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {studentsToPickup.map((student) => (
              <div key={student.id} className="p-4 border-b last:border-b-0 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.grade} • {student.studentId}</div>
                      <div className="text-xs text-gray-400">Đón: {student.pickupTime} • Trả: {student.dropoffTime}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStudentCheck(student.id, 'pickup')}
                      disabled={checkedStudents.has(`${student.id}-pickup`)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        checkedStudents.has(`${student.id}-pickup`)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      {checkedStudents.has(`${student.id}-pickup`) ? '✓ Đã đón' : 'Đón'}
                    </button>
                    <button
                      onClick={() => handleStudentCheck(student.id, 'dropoff')}
                      disabled={checkedStudents.has(`${student.id}-dropoff`)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        checkedStudents.has(`${student.id}-dropoff`)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                      }`}
                    >
                      {checkedStudents.has(`${student.id}-dropoff`) ? '✓ Đã trả' : 'Trả'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Reporting */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="text-orange-600" size={24} />
                  Báo cáo sự cố
                </h2>
                <button
                  onClick={() => setShowIncidentForm(!showIncidentForm)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  + Báo cáo mới
                </button>
              </div>
            </div>
            
            {showIncidentForm && (
              <div className="p-6 border-b bg-orange-50">
                <form onSubmit={handleIncidentReport} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loại sự cố
                    </label>
                    <select
                      name="type"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Chọn loại sự cố</option>
                      <option value="Tắc đường">Tắc đường</option>
                      <option value="Hỏng xe">Hỏng xe</option>
                      <option value="Tai nạn">Tai nạn</option>
                      <option value="Học sinh ốm">Học sinh ốm</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả chi tiết
                    </label>
                    <textarea
                      name="description"
                      required
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Mô tả chi tiết sự cố..."
                    ></textarea>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Gửi báo cáo
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowIncidentForm(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="max-h-64 overflow-y-auto">
              {incidents.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <CheckCircle className="mx-auto mb-2 text-green-500" size={48} />
                  <p>Không có sự cố nào được báo cáo hôm nay</p>
                </div>
              ) : (
                incidents.map((incident) => (
                  <div key={incident.id} className="p-4 border-b last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">{incident.type}</div>
                        <div className="text-sm text-gray-600 mt-1">{incident.description}</div>
                        <div className="text-xs text-gray-400 mt-2">{incident.time}</div>
                      </div>
                      <span className="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full">
                        {incident.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
            <div className="space-y-3">
              <button
                onClick={() => alert('Đã gửi tin nhắn khẩn cấp cho quản lý!')}
                className="w-full bg-red-50 hover:bg-red-100 text-red-700 py-3 px-4 rounded-lg transition-colors flex items-center gap-3"
              >
                <AlertTriangle size={20} />
                Gửi cảnh báo khẩn cấp
              </button>
              <button
                onClick={() => alert('Đã thông báo hoàn thành chuyến đi!')}
                className="w-full bg-green-50 hover:bg-green-100 text-green-700 py-3 px-4 rounded-lg transition-colors flex items-center gap-3"
              >
                <CheckCircle size={20} />
                Hoàn thành chuyến đi
              </button>
              <button
                onClick={() => {
                  const message = prompt('Gửi tin nhắn cho quản lý:');
                  if (message) alert(`Đã gửi: "${message}"`);
                }}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 px-4 rounded-lg transition-colors flex items-center gap-3"
              >
                <MessageSquare size={20} />
                Nhắn tin cho quản lý
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}