import React from 'react';
import StatCard from '../components/StatCard';
import ActivityList from '../components/ActivityList';
import { mockStudents, mockBuses, mockDrivers, mockRoutes, mockTracking } from '../data/mockData';
import { 
  Users, 
  Bus, 
  User, 
  MapPin, 
  BarChart3, 
  Zap,
  Plus
} from 'lucide-react';

export default function Overview() {
  const activeStudents = mockStudents.filter(s => s.status === 'active').length;
  const activeBuses = mockBuses.filter(b => b.status === 'active').length;
  const activeDrivers = mockDrivers.filter(d => d.status === 'active').length;
  const activeRoutes = mockRoutes.filter(r => r.status === 'active').length;

  const stats = [
    { 
      title: 'Tổng học sinh', 
      value: activeStudents.toString(), 
      meta: `${activeStudents}/${mockStudents.length} đang hoạt động`,
      icon: Users,
      color: 'bg-blue-500'
    },
    { 
      title: 'Xe buýt hoạt động', 
      value: activeBuses.toString(), 
      meta: `${activeBuses}/${mockBuses.length} xe đang chạy`,
      icon: Bus,
      color: 'bg-green-500'
    },
    { 
      title: 'Tài xế', 
      value: activeDrivers.toString(), 
      meta: `${activeDrivers}/${mockDrivers.length} tài xế có mặt`,
      icon: User,
      color: 'bg-purple-500'
    },
    { 
      title: 'Tuyến đường', 
      value: activeRoutes.toString(), 
      meta: `${activeRoutes}/${mockRoutes.length} tuyến đang hoạt động`,
      icon: MapPin,
      color: 'bg-orange-500'
    },
  ];

  const activities = [
    { 
      text: 'Xe BS-001 đã hoàn thành lộ trình sáng', 
      time: '10 phút trước', 
      color: 'bg-green-500',
      type: 'success'
    },
    { 
      text: 'Học sinh Nguyễn Văn An đã lên xe tại điểm dừng 2', 
      time: '15 phút trước', 
      color: 'bg-blue-500',
      type: 'info'
    },
    { 
      text: 'Xe BS-003 bị chậm 5 phút do tắc đường', 
      time: '20 phút trước', 
      color: 'bg-orange-400',
      type: 'warning'
    },
    { 
      text: 'Tài xế Trần Văn Tài báo cáo xe BS-001 hoạt động bình thường', 
      time: '25 phút trước', 
      color: 'bg-green-500',
      type: 'success'
    },
    { 
      text: 'Học sinh Trần Thị Bình đã xuống xe tại điểm dừng 3', 
      time: '30 phút trước', 
      color: 'bg-blue-500',
      type: 'info'
    },
  ];

  const todayStats = {
    totalTrips: 48,
    studentsTransported: 1205,
    averageTime: '28 phút',
    onTimeRate: '96.5%',
    activeTracking: mockTracking.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tổng quan hệ thống</h1>
          <p className="text-gray-600 mt-1">Theo dõi hoạt động xe buýt trường học</p>
        </div>
        <div className="text-sm text-gray-500">
          Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
        </div>
      </div>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="min-h-[120px]">
            <StatCard {...stat} />
          </div>
        ))}
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activities */}
        <div className="lg:col-span-2">
          <ActivityList items={activities} />
        </div>
        
        {/* Today's Stats */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
            <BarChart3 className="text-blue-500" size={20} />
            Thống kê hôm nay
          </h3>
          <ul className="text-sm text-gray-700 space-y-3">
            <li className="flex justify-between items-center">
              <span>Tổng chuyến đi</span>
              <span className="font-bold text-lg text-blue-600">{todayStats.totalTrips}</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Học sinh đã đưa đón</span>
              <span className="font-bold text-lg text-green-600">{todayStats.studentsTransported}</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Thời gian trung bình</span>
              <span className="font-bold text-lg text-purple-600">{todayStats.averageTime}</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Tỉ lệ đúng giờ</span>
              <span className="font-bold text-lg text-green-600">{todayStats.onTimeRate}</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Xe đang theo dõi</span>
              <span className="font-bold text-lg text-orange-600">{todayStats.activeTracking}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="font-semibold mb-4 text-lg flex items-center gap-2">
          <Zap className="text-green-500" size={20} />
          Thao tác nhanh
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
            <Users className="text-blue-600 mb-2" size={32} />
            <div className="text-sm font-medium text-blue-800">Thêm học sinh</div>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
            <Bus className="text-green-600 mb-2" size={32} />
            <div className="text-sm font-medium text-green-800">Thêm xe buýt</div>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
            <User className="text-purple-600 mb-2" size={32} />
            <div className="text-sm font-medium text-purple-800">Thêm tài xế</div>
          </button>
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors">
            <MapPin className="text-orange-600 mb-2" size={32} />
            <div className="text-sm font-medium text-orange-800">Theo dõi xe</div>
          </button>
        </div>
      </section>
    </div>
  );
}
