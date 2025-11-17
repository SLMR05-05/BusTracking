import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents  } from "react-leaflet";
import {
  RefreshCw,
  Bell,
  Bus,
  Users,
  Route,
  User,
  MapPin,
  Calendar,
} from "lucide-react";
import "leaflet/dist/leaflet.css";

const OverviewDashboard = () => {
  // Mock data
  const [stats, setStats] = useState({
    totalStudents: 120,
    activeBuses: 5,
    totalDrivers: 8,
    totalRoutes: 6,
    totalStations: 3,
    totalSchedule: 5,
  });

  const [buses, setBuses] = useState([
    {
      id: 1,
      plate: "51B-223.41",
      lat: 10.7765,
      lng: 106.7009,
      status: "Đang chạy",
    },
    {
      id: 2,
      plate: "51B-556.23",
      lat: 10.7841,
      lng: 106.6992,
      status: "Đang dừng",
    },
  ]);

  const [activities, setActivities] = useState([
    { time: "07:45", text: "Xe 51B-223.41 khởi hành từ Trường A" },
    { time: "07:50", text: "Học sinh Minh Anh đã lên xe 51B-556.23" },
    { time: "07:52", text: "Xe 51B-556.23 bị kẹt xe tại đường Trần Hưng Đạo" },
  ]);

  const [autoRefresh, setAutoRefresh] = useState(true);

  // Giả lập refresh dữ liệu mỗi 5s
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      console.log("🔄 Cập nhật dữ liệu...");
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleManualRefresh = () => {
    console.log("🧩 Refresh thủ công");
  };
  
  function AddStop({ onAdd }) {
    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;
        console.log("📍 Tọa độ mới:", lat, lng);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=vi`
          );
          const data = await res.json();
          console.log("📍 Địa chỉ:", data.display_name);
          onAdd({ lat, lng, address: data.display_name });
        } catch (err) {
          console.error("❌ Lỗi khi lấy địa chỉ:", err);
        }
      },
    });
    return null;
  }

  return (
    <div className="p-5 bg-gray-50 min-h-screen text-gray-800 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Tổng quan</h1>
          <p className="text-gray-500 text-sm">
            Theo dõi hoạt động và vị trí xe buýt theo thời gian thực
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            className="p-2 bg-white shadow rounded-full hover:bg-gray-100"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button className="p-2 bg-white shadow rounded-full hover:bg-gray-100 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <label className="flex items-center gap-2 ml-3 text-sm">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Tự động cập nhật
          </label>
        </div>
      </div>

      {/* THỐNG KÊ NHANH */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          color="bg-blue-100"
          icon={<Users className="text-blue-600" />}
          label="Học sinh"
          value={stats.totalStudents}
        />
        <StatCard
          color="bg-green-100"
          icon={<User className="text-green-600" />}
          label="Tài xế"
          value={stats.totalDrivers}
        />
        <StatCard
          color="bg-yellow-100"
          icon={<Bus className="text-yellow-600" />}
          label="Xe hoạt động"
          value={stats.activeBuses}
        />
        <StatCard
          color="bg-purple-100"
          icon={<Route className="text-purple-600" />}
          label="Tuyến đường"
          value={stats.totalRoutes}
        />
        <StatCard
          color="bg-pink-100"
          icon={<MapPin className="text-pink-600" />}
          label="Trạm"
          value={stats.totalStations}
        />
        <StatCard
          color="bg-red-100"
          icon={<Calendar className="text-red-600" />}
          label="Lịch trình"
          value={stats.totalSchedule}
        />
      </div>

      {/* BẢN ĐỒ */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="p-3 border-b flex justify-between items-center">
          <h2 className="font-semibold">Bản đồ theo dõi xe</h2>
          <p className="text-sm text-gray-500">
            Số xe đang hiển thị: {buses.length}
          </p>
        </div>
        <div className="h-[450px]">
          <MapContainer
            center={[10.7765, 106.7009]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {buses.map((bus) => (
              <Marker key={bus.id} position={[bus.lat, bus.lng]}>
                <Popup>
                  <div className="text-sm">
                    <b>{bus.plate}</b>
                    <br />
                    Trạng thái: {bus.status}
                  </div>
                </Popup>
              </Marker>
            ))}
             <AddStop onAdd={(pos) => console.log('Điểm dừng mới:', pos)} />
          </MapContainer>
        </div>
      </div>

    </div>
  );
};

// Component hiển thị card thống kê
const StatCard = ({ icon, label, value, color }) => (
  <div
    className={`rounded-xl p-4 shadow flex flex-col items-start justify-center gap-2 ${color}`}
  >
    <div className="text-gray-700">{icon}</div>
    <div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-gray-600 text-sm">{label}</div>
    </div>
  </div>
);

export default OverviewDashboard;
