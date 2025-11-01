import React, { useState, useEffect } from 'react';
import { mockStudents, mockParents } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, MapPin, User, Calendar, Filter, Search } from 'lucide-react';

export default function ParentHistory() {
  const { user } = useAuth();
  const [myChildren, setMyChildren] = useState([]);
  const [tripHistory, setTripHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [selectedChild, setSelectedChild] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [dateRange, setDateRange] = useState('week');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate finding parent's children
    const parentInfo = mockParents.find(p => p.name.includes(user?.name?.split(' ')[0] || 'Nguyễn'));
    const children = mockStudents.filter(student => student.parentId === (parentInfo?.id || 1));
    setMyChildren(children);
    
    // Generate more comprehensive trip history
    const generateTripHistory = () => {
      const history = [];
      const today = new Date();
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;
        
        children.forEach(child => {
          // Morning pickup
          const morningTrip = {
            id: `${child.id}-${i}-pickup`,
            childId: child.id,
            childName: child.name,
            date: date.toISOString().split('T')[0],
            type: 'pickup',
            time: child.pickupTime || '07:30',
            location: `Điểm dừng ${child.pickupStopId || 1} - ${child.address}`,
            status: Math.random() > 0.15 ? 'completed' : (Math.random() > 0.5 ? 'delayed' : 'cancelled'),
            busId: child.busId || 'BS-001',
            driverName: 'Trần Văn Tài',
            notes: Math.random() > 0.7 ? 'Đón đúng giờ, con em lên xe an toàn' : 
                   Math.random() > 0.5 ? 'Chậm 5 phút do tắc đường' : ''
          };
          
          // Afternoon dropoff
          const afternoonTrip = {
            id: `${child.id}-${i}-dropoff`,
            childId: child.id,
            childName: child.name,
            date: date.toISOString().split('T')[0],
            type: 'dropoff',
            time: child.dropoffTime || '17:00',
            location: `Điểm dừng ${child.dropoffStopId || 1} - ${child.address}`,
            status: Math.random() > 0.1 ? 'completed' : (Math.random() > 0.5 ? 'delayed' : 'cancelled'),
            busId: child.busId || 'BS-001',
            driverName: 'Trần Văn Tài',
            notes: Math.random() > 0.8 ? 'Trả con em về nhà an toàn' : 
                   Math.random() > 0.6 ? 'Trả về muộn 10 phút do tắc đường' : ''
          };
          
          history.push(morningTrip, afternoonTrip);
        });
      }
      
      return history.sort((a, b) => new Date(b.date) - new Date(a.date));
    };
    
    const history = generateTripHistory();
    setTripHistory(history);
    setFilteredHistory(history);
  }, [user]);

  useEffect(() => {
    let filtered = tripHistory;

    // Filter by child
    if (selectedChild !== 'all') {
      filtered = filtered.filter(trip => trip.childId === parseInt(selectedChild));
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(trip => trip.status === selectedStatus);
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(trip => trip.type === selectedType);
    }

    // Filter by date range
    const today = new Date();
    if (dateRange !== 'all') {
      const daysBack = dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : 90;
      const cutoffDate = new Date(today);
      cutoffDate.setDate(cutoffDate.getDate() - daysBack);
      filtered = filtered.filter(trip => new Date(trip.date) >= cutoffDate);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(trip => 
        trip.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.notes.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredHistory(filtered);
  }, [tripHistory, selectedChild, selectedStatus, selectedType, dateRange, searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'delayed': return 'text-orange-600 bg-orange-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'delayed': return 'Chậm trễ';
      case 'cancelled': return 'Hủy bỏ';
      default: return 'Không xác định';
    }
  };

  const getTypeText = (type) => {
    return type === 'pickup' ? 'Đón' : 'Trả';
  };

  const getTypeIcon = (type) => {
    return type === 'pickup' ? '🚌➡️' : '🚌⬅️';
  };

  const getStats = () => {
    const total = filteredHistory.length;
    const completed = filteredHistory.filter(t => t.status === 'completed').length;
    const delayed = filteredHistory.filter(t => t.status === 'delayed').length;
    const cancelled = filteredHistory.filter(t => t.status === 'cancelled').length;
    const onTimeRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, delayed, cancelled, onTimeRate };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Lịch sử chuyến đi</h1>
            <p className="text-blue-100 mt-1">Theo dõi chi tiết các chuyến đón trả con em</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-blue-100">Chuyến đi</div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Hoàn thành</div>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
              ✅
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Chậm trễ</div>
              <div className="text-2xl font-bold text-orange-600">{stats.delayed}</div>
            </div>
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
              ⏰
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Hủy bỏ</div>
              <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            </div>
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white">
              ❌
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Tỷ lệ đúng giờ</div>
              <div className="text-2xl font-bold text-blue-600">{stats.onTimeRate}%</div>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              📊
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="text-gray-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên, địa điểm..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Child filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Con em
            </label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              {myChildren.map(child => (
                <option key={child.id} value={child.id}>{child.name}</option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="completed">Hoàn thành</option>
              <option value="delayed">Chậm trễ</option>
              <option value="cancelled">Hủy bỏ</option>
            </select>
          </div>

          {/* Type filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại chuyến
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="pickup">Đón</option>
              <option value="dropoff">Trả</option>
            </select>
          </div>

          {/* Date range filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời gian
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">7 ngày qua</option>
              <option value="month">30 ngày qua</option>
              <option value="quarter">3 tháng qua</option>
              <option value="all">Tất cả</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trip History */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="text-blue-600" size={24} />
            Lịch sử chuyến đi ({filteredHistory.length} chuyến)
          </h2>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="mx-auto mb-4 text-gray-400" size={64} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không có chuyến đi nào
              </h3>
              <p className="text-gray-600">
                Không tìm thấy chuyến đi nào phù hợp với bộ lọc hiện tại.
              </p>
            </div>
          ) : (
            filteredHistory.map((trip) => (
              <div
                key={trip.id}
                className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">
                      {getTypeIcon(trip.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {getTypeText(trip.type)} {trip.childName}
                        </span>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(trip.status)}`}>
                          {getStatusText(trip.status)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>{new Date(trip.date).toLocaleDateString('vi-VN')} - {trip.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span>{trip.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User size={14} />
                          <span>Tài xế: {trip.driverName} - Xe {trip.busId}</span>
                        </div>
                        {trip.notes && (
                          <div className="text-xs text-gray-500 italic mt-2 p-2 bg-gray-50 rounded">
                            {trip.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    {trip.type === 'pickup' ? 'Sáng' : 'Chiều'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}