import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Navigation, CheckCircle, Circle, MapPin, AlertTriangle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import RouteMap from "../../components/RouteMap";

const API_BASE_URL = "http://localhost:5000/api";

export default function DriverTracking() {
  const { user, token } = useAuth();
  const { scheduleId } = useParams();

  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [stops, setStops] = useState([]);
  const [students, setStudents] = useState([]);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [isAtStop, setIsAtStop] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [canRun, setCanRun] = useState(false);

  const authHeader = {
    headers: { Authorization: `Bearer ${token || localStorage.getItem("token")}` },
  };

  // ------------------------------------------------------------------
  // 1️Load lịch + trạm + học sinh
  // ------------------------------------------------------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Lấy danh sách lịch
        const schedules = (
          await axios.get(`${API_BASE_URL}/driver-dashboard/schedules`, authHeader)
        ).data;

        const schedule =
          schedules.find((s) => String(s.MaLT) === String(scheduleId)) || schedules[0];

        if (!schedule) return setLoading(false);

        setCurrentSchedule(schedule);

        const [stopsRes, studentsRes, attendRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/driver-dashboard/schedules/${schedule.MaLT}/stops`, authHeader),
          axios.get(`${API_BASE_URL}/driver-dashboard/schedules/${schedule.MaLT}/students`, authHeader),
          axios.get(`${API_BASE_URL}/driver-dashboard/schedules/${schedule.MaLT}/attendance`, authHeader),
        ]);

        // Xử lý trạm
        const formattedStops = stopsRes.data.map((s) => ({
          id: s.MaTram,
          detailId: s.MaCTLT,
          name: s.TenTram,
          address: s.DiaChi,
          lat: +s.ViDo,
          lng: +s.KinhDo,
          status: s.TrangThaiQua === "1" ? "completed" : "pending",
        }));

        setStops(formattedStops);
        const firstPendingIndex = formattedStops.findIndex((s) => s.status === "pending");
        setCurrentStopIndex(firstPendingIndex >= 0 ? firstPendingIndex : 0);
        
        // Kiểm tra đã bắt đầu chưa (có trạm nào completed)
        const alreadyStarted = formattedStops.some((s) => s.status === "completed");
        setHasStarted(alreadyStarted);

        // Xử lý học sinh
        const formattedStudents = studentsRes.data.map((sv) => ({
          id: sv.MaHS,
          name: sv.TenHS,
          class: sv.Lop,
          stopId: sv.MaTram,
          status: attendRes.data.find((a) => a.MaHS === sv.MaHS)?.TrangThai || "0",
          avatar: sv.TenHS?.charAt(0) || "U",
        }));

        setStudents(formattedStudents);

        // Kiểm tra quyền chạy
        const permissionRes = await axios.get(
          `${API_BASE_URL}/driver-dashboard/schedules/${schedule.MaLT}/permission`,
          authHeader
        );
        setCanRun(permissionRes.data.canRun);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token, scheduleId]);

  // ------------------------------------------------------------------
  // 2 Điểm danh học sinh
  // ------------------------------------------------------------------
  const toggleStudentStatus = async (id) => {
    if (!canRun || !hasStarted) {
      alert("Vui lòng bắt đầu chạy lịch trình trước!");
      return;
    }
    try {
      const student = students.find((s) => s.id === id);
      const newStatus = student.status === "2" ? "0" : "2";

      await axios.post(
        `${API_BASE_URL}/driver-dashboard/schedules/${currentSchedule.MaLT}/students/${id}/attendance`,
        { status: newStatus },
        authHeader
      );

      setStudents((p) => p.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
    } catch {
      alert("Lỗi cập nhật điểm danh!");
    }
  };

  // ------------------------------------------------------------------
  // 3️ Xử lý trạm
  // ------------------------------------------------------------------
  const handleStartRoute = () => {
    if (!canRun) {
      alert("Bạn chưa có quyền chạy lịch trình này!");
      return;
    }
    setHasStarted(true);
    setIsAtStop(true);
  };

  const handleArriveStop = () => {
    if (!canRun) {
      alert("Bạn chưa có quyền chạy lịch trình này!");
      return;
    }
    setIsAtStop(true);
    if (navigator.vibrate) navigator.vibrate([200, 80, 200]);
  };

  const handleDepartStop = async () => {
    if (!canRun) {
      alert("Bạn chưa có quyền chạy lịch trình này!");
      return;
    }
    try {
      const stop = stops[currentStopIndex];

      // Cập nhật trạng thái trạm
      await axios.put(
        `${API_BASE_URL}/schedules/details/${stop.detailId}/status`,
        { status: "1" },
        authHeader
      );

      // Gửi thông báo cho phụ huynh khi xe qua trạm
      try {
        await axios.post(
          `${API_BASE_URL.replace('/driver-dashboard', '/driver-notifications')}/stop-passed`,
          {
            scheduleId: currentSchedule.MaLT,
            stopId: stop.id
          },
          authHeader
        );
        console.log('✅ Đã gửi thông báo qua trạm');
      } catch (notifErr) {
        console.error('⚠️ Lỗi gửi thông báo:', notifErr);
      }

      setStops((p) => p.map((s, i) => (i === currentStopIndex ? { ...s, status: "completed" } : s)));

      if (currentStopIndex < stops.length - 1) {
        setCurrentStopIndex((i) => i + 1);
        setIsAtStop(false);
      } else {
        alert("🎉 Hoàn thành toàn bộ lộ trình!");
        setIsAtStop(false);
      }
    } catch {
      alert("Lỗi cập nhật trạng thái trạm!");
    }
  };

  // ------------------------------------------------------------------
  // 4️ Lọc học sinh của trạm hiện tại
  // ------------------------------------------------------------------
  const currentStopStudents = useMemo(() => {
    const stop = stops[currentStopIndex];
    return stop ? students.filter((s) => s.stopId === stop.id) : [];
  }, [students, stops, currentStopIndex]);

  const completedCount = currentStopStudents.filter((s) => s.status === "2").length;

  // Debug
  console.log('🔍 [DriverTracking] hasStarted:', hasStarted);
  console.log('🔍 [DriverTracking] canRun:', canRun);
  console.log('🔍 [DriverTracking] isAtStop:', isAtStop);

  // ------------------------------------------------------------------
  // 5UI Loading
  // ------------------------------------------------------------------
  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Đang tải dữ liệu...</p>
      </div>
    );

  if (!currentSchedule)
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-600">
        <AlertTriangle size={60} className="mb-3" />
        <p>Không có lịch chạy hôm nay.</p>
      </div>
    );

  // ------------------------------------------------------------------
  // 6️ UI Chính
  // ------------------------------------------------------------------
  return (
    <div className="h-[calc(100vh-100px)] flex gap-4">
      {/* Bản đồ */}
      <div className="w-3/5 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-xl shadow flex items-center justify-between">
          <div>
            <h2 className="font-bold flex items-center gap-2">
              <Navigation size={20} /> Bản đồ lộ trình
            </h2>
            {stops[currentStopIndex] && (
              <p className="text-sm text-blue-600">
                Đang đến: <b>{stops[currentStopIndex].name}</b>
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!hasStarted && (
              <button
                onClick={handleStartRoute}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg font-bold flex items-center gap-2 animate-pulse"
              >
                Bắt đầu chạy
              </button>
            )}

            {hasStarted && !isAtStop && (
              <button
                onClick={handleArriveStop}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg font-semibold flex items-center gap-2"
              >
                 Đã đến trạm
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 bg-gray-200 rounded-xl relative overflow-hidden">
          <RouteMap stops={stops} />
        </div>
      </div>

      {/* Panel phải */}
      <div className="w-2/5 flex flex-col">
        {!isAtStop ? (
          /* Danh sách trạm */
          <div className="bg-white p-4 rounded-xl shadow flex-1 overflow-y-auto">
            <div className="mb-4 pb-3 border-b">
              <h3 className="font-bold text-gray-800">Lộ trình chuyến đi</h3>
              <p className="text-xs text-gray-500 mt-1">
                {hasStarted ? "Đang thực hiện" : "Chưa bắt đầu"}
              </p>
            </div>

            {stops.map((s, i) => {
              const isCurrent = i === currentStopIndex;
              const isPast = i < currentStopIndex;

              return (
                <div key={s.id} className="flex items-start gap-3 mb-5 relative">
                  {i < stops.length - 1 && (
                    <div className={`absolute left-3 top-8 w-0.5 h-full ${isPast ? "bg-green-500" : "bg-gray-300"}`} />
                  )}
                  
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 bg-white ${
                      isPast ? "border-green-500 text-green-500" : 
                      isCurrent ? "border-blue-500 text-blue-500 animate-pulse" : 
                      "border-gray-300 text-gray-300"
                    }`}
                  >
                    {isPast ? <CheckCircle size={14} fill="currentColor" /> : <Circle size={10} fill="currentColor" />}
                  </div>

                  <div className="flex-1">
                    <p className={`font-bold ${isCurrent ? "text-blue-600" : isPast ? "text-gray-600" : "text-gray-400"}`}>
                      {s.name}
                    </p>
                    <p className="text-xs text-gray-500">{s.address}</p>
                    {isCurrent && hasStarted && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded mt-1 inline-block">
                        Đang đến
                      </span>
                    )}
                    {isPast && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded mt-1 inline-block">
                        Hoàn thành
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Điểm danh học sinh */
          <div className="bg-white rounded-xl shadow flex-1 flex flex-col">
            <div className="p-4 bg-blue-600 text-white">
              <h2 className="font-bold">{stops[currentStopIndex]?.name}</h2>
              <p className="text-sm mt-2">
                {completedCount}/{currentStopStudents.length} đã lên xe
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
              {currentStopStudents.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  Không có học sinh nào ở trạm này
                </div>
              ) : (
                currentStopStudents.map((st) => {
                  const done = st.status === "2";

                  return (
                    <div
                      key={st.id}
                      onClick={() => toggleStudentStatus(st.id)}
                      className={`p-3 rounded-lg flex justify-between items-center mb-2 cursor-pointer transition-all ${
                        done ? "bg-green-50 border-2 border-green-200" : "bg-white border-2 border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${done ? "bg-green-500" : "bg-gray-400"}`}>
                          {st.avatar}
                        </div>
                        <div>
                          <p className={`font-bold ${done ? "text-green-800" : "text-gray-800"}`}>{st.name}</p>
                          <p className="text-xs text-gray-500">
                            Lớp {st.class} • {done ? "Hoàn thành" : "Chưa hoàn thành"}
                          </p>
                        </div>
                      </div>

                      <CheckCircle size={24} className={done ? "text-green-600" : "text-gray-300"} />
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 bg-white border-t">
              <button
                onClick={handleDepartStop}
                className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                ➜ Tiếp tục hành trình
              </button>
              {completedCount < currentStopStudents.length && (
                <p className="text-center text-xs text-orange-500 mt-2 flex items-center justify-center gap-1">
                  <AlertTriangle size={12} /> Còn {currentStopStudents.length - completedCount} học sinh chưa hoàn thành
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
