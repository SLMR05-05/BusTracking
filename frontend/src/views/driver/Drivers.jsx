import React, { useEffect, useState } from "react";
import {
  Bus,
  Clock,
  Send,
  AlertTriangle,
  MessageSquare,
  MapPin,
  User,
  Phone,
  FileText,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { getDriverDashboard } from "../services/driverDashboardService";
import IncidentReportModal from "./form/DriverIncidentReport";
import PerformanceStatsModal from "./form/PerformanceStatsModal";
import ScheduleDetailModal from "./form/ScheduleDetail";
export default function DriverDashboard() {
  const [data, setData] = useState(null);


  const handleStartTrip = () => alert("Bắt đầu lộ trình!");
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const handleMessages = () => alert("Mở hộp thư!");
  const handleMap = () => alert("Mở bản đồ!");
  const handleReportIncident = (report) => {
    console.log("Báo cáo mới:", report);
    alert("Đã gửi báo cáo sự cố!");
  };


  // Giả lập tài xế đang đăng nhập
  const driverId = 1;

  useEffect(() => {
    const dashboardData = getDriverDashboard(driverId);
    setData(dashboardData);
  }, []);

  if (!data) return <div className="p-6">Đang tải dữ liệu...</div>;

  const { driver, bus, route, schedules, attendance, incidents, messages, stats } =
    data;

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Xin chào, {driver.name}</h2>
          <p className="text-gray-500 text-sm">Tài xế - {bus.busId}</p>
          <p className="text-gray-400 text-sm">{bus.licensePlate}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 bg-purple-100 rounded-lg">
            <i className="ri-home-2-line text-purple-700 text-xl"></i>
          </button>
          <button className="p-2 bg-gray-100 rounded-lg">
            <i className="ri-settings-3-line text-gray-700 text-xl"></i>
          </button>
          <button className="p-2 bg-gray-100 rounded-lg">
            <i className="ri-logout-box-line text-gray-700 text-xl"></i>
          </button>
        </div>
      </div>

      {/* Xe info */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-2xl p-6 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Bus size={22} /> <span>Xe {bus.busId}</span>
          </div>
          <p className="mt-1 text-sm">Tuyến: {route.name}</p>
          <p className="text-sm">Bằng lái: {driver.licenseNumber}</p>
        </div>
        <div className="text-right">
          <span className="bg-green-500 text-xs px-3 py-1 rounded-full">
            Đang hoạt động
          </span>
          <p className="mt-2 text-sm">
            Liên hệ: <a href={`tel:${driver.phone}`} className="underline">{driver.phone}</a>
          </p>
          <button 
          onClick={() => setShowStatsModal(true)}
          className="mt-3 bg-white text-purple-700 rounded-xl px-4 py-2 text-sm font-medium shadow hover:bg-purple-50">
            Xem thống kê
          </button>
        </div>
      </div>

      {/* Ca sáng & Ca chiều */}
      <div className="grid md:grid-cols-2 gap-6">
        {schedules.map((s) => (
          <div
            key={s.id}
            onClick={() => setSelectedSchedule(s)}
            className="bg-white rounded-2xl shadow p-5 cursor-pointer hover:shadow-lg transition"
          >
            <div
              className={`flex items-center gap-2 font-semibold mb-3 ${
                s.shift === "Ca sáng" ? "text-blue-600" : "text-orange-600"
              }`}
            >
              <Clock size={18} /> <span>{s.shift}</span>
            </div>
            <p>Giờ khởi hành: <b>{new Date(s.startTime).toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'})}</b></p>
            <p>Giờ đến dự kiến: <b>{new Date(s.endTime).toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'})}</b></p>
            <p>Học sinh: <b>{s.studentCount}/24</b></p>
            <div
              className={`mt-3 rounded-lg text-center py-2 text-sm font-medium ${
                s.status === "completed"
                  ? "bg-green-500 text-white"
                  : s.status === "upcoming"
                  ? "bg-blue-500 text-white"
                  : "bg-yellow-400 text-white"
              }`}
            >
              {s.status === "completed" ? "✓ Đã hoàn thành" : s.status === "upcoming" ? "⏱ Sắp diễn ra" : "🔄 Đang chạy"}
            </div>
          </div>
        ))}
      </div>

      {/*Thanh Chức Năng*/}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium shadow flex justify-center items-center gap-2">
          <Send size={18} /> Bắt đầu lộ trình
        </button>
        <button
          onClick={() => setShowIncidentModal(true)}
          className="flex items-center justify-center gap-2 border border-red-500 text-red-500 hover:bg-red-50 font-medium rounded-xl py-3 shadow transition"
          >
          <AlertTriangle size={18} /> Báo sự cố
          </button>
        <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-medium shadow flex justify-center items-center gap-2">
          <MessageSquare size={18} /> Tin nhắn
        </button>
        <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-medium shadow flex justify-center items-center gap-2">
          <MapPin size={18} /> Chỉ đường
        </button>
      </div>

      {/* Danh sách học sinh */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="font-semibold flex items-center gap-2 mb-3">
          <User size={18} /> Danh sách học sinh
        </h3>
        {attendance.map((a) => (
          <div key={a.id} className="border rounded-xl p-4 mb-3">
            <div className="flex justify-between">
              <p className="font-medium">Mã HS: {a.studentId}</p>
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  a.status === "LenXe"
                    ? "bg-green-100 text-green-600"
                    : a.status === "XuongXe"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {a.status}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Thời gian: {a.time ? new Date(a.time).toLocaleTimeString("vi-VN") : "Chưa có"}
            </p>
          </div>
        ))}
      </div>

      {/* Sự cố */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="font-semibold flex items-center gap-2 mb-3">
          <AlertTriangle size={18} /> Sự cố gần đây
        </h3>
        {incidents.length === 0 && <p className="text-gray-500 text-sm">Không có sự cố nào.</p>}
        {incidents.map((i) => (
          <div key={i.id} className="border rounded-xl p-4 mb-3">
            <p className="font-medium">{i.type}</p>
            <p className="text-sm text-gray-600">{i.description}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(i.time).toLocaleString("vi-VN")} - {i.status}
            </p>
          </div>
        ))}
      </div>

      {/* Tin nhắn */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="font-semibold flex items-center gap-2 mb-3">
          <MessageSquare size={18} /> Tin nhắn
        </h3>
        {messages.map((m) => (
          <div key={m.id} className="border-b py-2 text-sm">
            <p><b>{m.sender}</b>: {m.content}</p>
            <p className="text-gray-400 text-xs">
              {new Date(m.timestamp).toLocaleString("vi-VN")}
            </p>
          </div>
        ))}
      </div>

      {/* Thống kê */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow p-5 text-center">
          <Calendar size={24} className="mx-auto text-blue-600" />
          <p className="mt-2 text-gray-600 text-sm">Chuyến hôm nay</p>
          <p className="text-xl font-semibold">{stats.todayTrips}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-5 text-center">
          <User size={24} className="mx-auto text-green-600" />
          <p className="mt-2 text-gray-600 text-sm">Học sinh đón</p>
          <p className="text-xl font-semibold">{stats.studentsTransported}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-5 text-center">
          <CheckCircle size={24} className="mx-auto text-purple-600" />
          <p className="mt-2 text-gray-600 text-sm">Đúng giờ</p>
          <p className="text-xl font-semibold">{stats.onTimeRate}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-5 text-center">
          <Send size={24} className="mx-auto text-orange-600" />
          <p className="mt-2 text-gray-600 text-sm">Km đã đi</p>
          <p className="text-xl font-semibold">{stats.distanceTraveled}</p>
        </div>
      </div>
      {showIncidentModal && (
        <IncidentReportModal
          onClose={() => setShowIncidentModal(false)}
          onSubmit={handleReportIncident}
        />
      )}
      {showStatsModal && (
        <PerformanceStatsModal
          onClose={() => setShowStatsModal(false)}
          stats={{
            today: { trips: 2, students: 24, distance: 31, onTime: 100 },
            week: { trips: 10, students: 120, distance: 150, onTime: 95 },
            month: { trips: 40, students: 480, distance: 620, onTime: 97 },
          }}
        />
      )}
      {selectedSchedule && (
        <ScheduleDetailModal
          schedule={selectedSchedule}
          onClose={() => setSelectedSchedule(null)}
        />
      )}
    </div>
  );
}
