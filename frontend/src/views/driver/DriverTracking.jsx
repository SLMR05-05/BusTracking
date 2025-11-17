import React, { useState, useEffect } from "react";
import { Navigation, Users, AlertTriangle, CheckCircle } from "lucide-react";
import io from "socket.io-client";
import { mockTracking, mockStudents } from "../../data/mockData";
import { useAuth } from "../../contexts/AuthContext";
import MapView from "../../views/common/MapView"; // 👈 import bản đồ tách riêng

const socket = io("http://localhost:5000");

export default function DriverTracking() {
  const { user } = useAuth();
  const [busInfo, setBusInfo] = useState(null);
  const [position, setPosition] = useState(null);
  const [students, setStudents] = useState([]);
  const [isSharing, setIsSharing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Lấy xe tài xế
  useEffect(() => {
    const info = mockTracking.find(b => b.driverName.includes(user?.name || "Tài xế"));
    if (info) {
      setBusInfo(info);
      setStudents(mockStudents.filter(s => s.busId === info.busId));
    }
  }, [user]);

  // Theo dõi vị trí và gửi socket
  useEffect(() => {
    if (!isSharing) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setPosition(coords);
        setLastUpdate(new Date());

        socket.emit("driverLocation", {
          driverId: user?.id || "DRV001",
          busId: busInfo?.busId,
          ...coords,
        });
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isSharing, busInfo]);

  const handleToggleShare = () => setIsSharing(!isSharing);
  const handlePickup = (studentId) => alert(`Đã đón học sinh có ID: ${studentId}`);
  const handleDropoff = (studentId) => alert(`Đã trả học sinh có ID: ${studentId}`);

  const handleReportIssue = () => {
    const issue = prompt("Nhập mô tả sự cố:");
    if (issue) {
      socket.emit("driverIssue", { driver: user?.name, issue });
      alert("Đã gửi báo cáo!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 text-white rounded-xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Theo dõi chuyến xe</h1>
            <p className="text-yellow-100 mt-1">
              Cập nhật vị trí và trạng thái xe buýt
            </p>
          </div>
          <button
            onClick={handleToggleShare}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium ${
              isSharing
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            <Navigation size={18} />
            {isSharing ? "Dừng chia sẻ" : "Bắt đầu chuyến đi"}
          </button>
        </div>
      </div>

      {/* MapView */}
      <MapView
        title="Bản đồ vị trí tài xế"
        position={position}
        user={user}
        lastUpdate={lastUpdate}
      />

      {/* Student list */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users size={20} /> Danh sách học sinh
        </h3>
        {students.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {students.map((s) => (
              <div
                key={s.id}
                className="p-4 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{s.name}</h4>
                  <p className="text-sm text-gray-500">{s.address}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePickup(s.id)}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-lg flex items-center gap-1 text-sm"
                  >
                    <CheckCircle size={14} /> Đón
                  </button>
                  <button
                    onClick={() => handleDropoff(s.id)}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg flex items-center gap-1 text-sm"
                  >
                    <Navigation size={14} /> Trả
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Không có học sinh nào được gán.</p>
        )}
      </div>

      {/* Báo cáo */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <AlertTriangle size={20} /> Báo cáo sự cố
        </h3>
        <button
          onClick={handleReportIssue}
          className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          Gửi báo cáo
        </button>
      </div>
    </div>
  );
}
