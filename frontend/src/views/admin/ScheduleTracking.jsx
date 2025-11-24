import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { ArrowLeft, MapPin, Clock, CheckCircle, XCircle, Circle } from "lucide-react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const API_URL = "http://localhost:5000/api";

const ScheduleTracking = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  
  const [schedule, setSchedule] = useState(null);
  const [stations, setStations] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScheduleData();
  }, [scheduleId]);

  const fetchScheduleData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch schedule details
      const scheduleRes = await axios.get(`${API_URL}/schedules/${scheduleId}`, config);
      setSchedule(scheduleRes.data);

      // Fetch stations for this route
      const stationsRes = await axios.get(
        `${API_URL}/routes/${scheduleRes.data.MaTD}/stops`,
        config
      );
      setStations(stationsRes.data);

      // Fetch attendance records
      const attendanceRes = await axios.get(
        `${API_URL}/schedules/${scheduleId}/attendance`,
        config
      );
      setAttendances(attendanceRes.data);

      // Get route coordinates
      if (stationsRes.data.length > 0) {
        const coords = stationsRes.data.map(station => [
          parseFloat(station.ViDo),
          parseFloat(station.KinhDo)
        ]);
        setRouteCoordinates(coords);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching schedule data:", error);
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.substring(0, 5);
  };

  const getAttendanceStatus = (stationId) => {
    const stationAttendances = attendances.filter(
      att => att.MaTram === stationId
    );
    
    if (stationAttendances.length === 0) return { status: "pending", count: 0 };
    
    // TrangThai: '0' = chưa đón, '1' = đã đón, '2' = đã trả
    const present = stationAttendances.filter(att => att.TrangThai === '1' || att.TrangThai === '2').length;
    const pending = stationAttendances.filter(att => att.TrangThai === '0').length;
    
    return { status: "checked", present, pending, total: stationAttendances.length };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="p-5">
        <p className="text-red-600">Không tìm thấy lịch trình</p>
      </div>
    );
  }

  const center = stations.length > 0
    ? [parseFloat(stations[0].ViDo), parseFloat(stations[0].KinhDo)]
    : [21.0285, 105.8542]; // Default to Hanoi

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/overview")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800">{schedule.TenTuyenDuong}</h1>
            <p className="text-sm text-gray-600">
              {formatTime(schedule.GioBatDau)} - {formatTime(schedule.GioKetThuc)} • Xe: {schedule.BienSo} • Tài xế: {schedule.TenTX}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map Section */}
        <div className="flex-1 relative">
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            
            {/* Route line */}
            {routeCoordinates.length > 0 && (
              <Polyline
                positions={routeCoordinates}
                color="#3b82f6"
                weight={4}
                opacity={0.7}
              />
            )}

            {/* Station markers */}
            {stations.map((station, index) => {
              const status = getAttendanceStatus(station.MaTram);
              const position = [parseFloat(station.ViDo), parseFloat(station.KinhDo)];
              
              return (
                <Marker key={station.MaTram} position={position}>
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold">{station.TenTram}</h3>
                      <p className="text-sm text-gray-600">Thứ tự: {index + 1}</p>
                      {status.status === "checked" ? (
                        <div className="mt-2 text-sm">
                          <p className="text-green-600">✓ Đã đón: {status.present}</p>
                          <p className="text-gray-600">○ Chưa đón: {status.pending}</p>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm mt-2">Chưa có dữ liệu</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Attendance List Section */}
        <div className="w-96 bg-white border-l overflow-y-auto">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-800">Danh sách điểm danh</h2>
            <p className="text-sm text-gray-600 mt-1">
              {attendances.length} học sinh
            </p>
          </div>

          <div className="divide-y">
            {stations.map((station, index) => {
              const stationAttendances = attendances.filter(
                att => att.MaTram === station.MaTram
              );
              const status = getAttendanceStatus(station.MaTram);

              return (
                <div key={station.MaTram} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{station.TenTram}</h3>
                      {status.status === "checked" ? (
                        <div className="flex items-center gap-3 mt-1 text-sm">
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle size={14} />
                            {status.present}
                          </span>
                          <span className="text-gray-600 flex items-center gap-1">
                            <Circle size={14} />
                            {status.pending}
                          </span>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                          <Circle size={14} />
                          Chưa có dữ liệu
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Student list for this station */}
                  {stationAttendances.length > 0 && (
                    <div className="ml-11 space-y-2">
                      {stationAttendances.map(att => {
                        const statusText = att.TrangThai === '1' ? 'Đã đón' : att.TrangThai === '2' ? 'Đã trả' : 'Chưa đón';
                        const statusColor = att.TrangThai === '1' || att.TrangThai === '2' ? 'green' : 'gray';
                        
                        return (
                          <div
                            key={att.MaHS}
                            className={`p-2 rounded-lg text-sm flex items-center justify-between ${
                              statusColor === 'green'
                                ? "bg-green-50 border border-green-200"
                                : "bg-gray-50 border border-gray-200"
                            }`}
                          >
                            <span className="font-medium">{att.TenHS}</span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                statusColor === 'green'
                                  ? "bg-green-200 text-green-800"
                                  : "bg-gray-200 text-gray-800"
                              }`}
                            >
                              {statusText}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {stations.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                <p>Không có trạm nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTracking;
