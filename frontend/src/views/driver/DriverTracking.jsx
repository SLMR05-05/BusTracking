// import React, { useState, useEffect } from "react";
// import { Navigation, Users, AlertTriangle, CheckCircle } from "lucide-react";
// import io from "socket.io-client";
// import { mockTracking, mockStudents } from "../../data/mockData";
// import { useAuth } from "../../contexts/AuthContext";
// import MapView from "../../views/common/MapView"; // 👈 import bản đồ tách riêng

// const socket = io("http://localhost:5000");

// export default function DriverTracking() {
//   const { user } = useAuth();
//   const [busInfo, setBusInfo] = useState(null);
//   const [position, setPosition] = useState(null);
//   const [students, setStudents] = useState([]);
//   const [isSharing, setIsSharing] = useState(false);
//   const [lastUpdate, setLastUpdate] = useState(new Date());

//   // Lấy xe tài xế
//   useEffect(() => {
//     const info = mockTracking.find(b => b.driverName.includes(user?.name || "Tài xế"));
//     if (info) {
//       setBusInfo(info);
//       setStudents(mockStudents.filter(s => s.busId === info.busId));
//     }
//   }, [user]);

//   // Theo dõi vị trí và gửi socket
//   useEffect(() => {
//     if (!isSharing) return;
//     const watchId = navigator.geolocation.watchPosition(
//       (pos) => {
//         const coords = {
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude,
//         };
//         setPosition(coords);
//         setLastUpdate(new Date());

//         socket.emit("driverLocation", {
//           driverId: user?.id || "DRV001",
//           busId: busInfo?.busId,
//           ...coords,
//         });
//       },
//       (err) => console.error(err),
//       { enableHighAccuracy: true }
//     );

//     return () => navigator.geolocation.clearWatch(watchId);
//   }, [isSharing, busInfo]);

//   const handleToggleShare = () => setIsSharing(!isSharing);
//   const handlePickup = (studentId) => alert(`Đã đón học sinh có ID: ${studentId}`);
//   const handleDropoff = (studentId) => alert(`Đã trả học sinh có ID: ${studentId}`);

//   const handleReportIssue = () => {
//     const issue = prompt("Nhập mô tả sự cố:");
//     if (issue) {
//       socket.emit("driverIssue", { driver: user?.name, issue });
//       alert("Đã gửi báo cáo!");
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 text-white rounded-xl p-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold">Theo dõi chuyến xe</h1>
//             <p className="text-yellow-100 mt-1">
//               Cập nhật vị trí và trạng thái xe buýt
//             </p>
//           </div>
//           <button
//             onClick={handleToggleShare}
//             className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium ${
//               isSharing
//                 ? "bg-red-600 hover:bg-red-700"
//                 : "bg-green-600 hover:bg-green-700"
//             }`}
//           >
//             <Navigation size={18} />
//             {isSharing ? "Dừng chia sẻ" : "Bắt đầu chuyến đi"}
//           </button>
//         </div>
//       </div>

//       {/* MapView */}
//       <MapView
//         title="Bản đồ vị trí tài xế"
//         position={position}
//         user={user}
//         lastUpdate={lastUpdate}
//       />

//       {/* Student list */}
//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//           <Users size={20} /> Danh sách học sinh
//         </h3>
//         {students.length ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {students.map((s) => (
//               <div
//                 key={s.id}
//                 className="p-4 border rounded-lg flex justify-between items-center"
//               >
//                 <div>
//                   <h4 className="font-medium text-gray-900">{s.name}</h4>
//                   <p className="text-sm text-gray-500">{s.address}</p>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => handlePickup(s.id)}
//                     className="bg-green-100 text-green-700 px-3 py-1 rounded-lg flex items-center gap-1 text-sm"
//                   >
//                     <CheckCircle size={14} /> Đón
//                   </button>
//                   <button
//                     onClick={() => handleDropoff(s.id)}
//                     className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg flex items-center gap-1 text-sm"
//                   >
//                     <Navigation size={14} /> Trả
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-600">Không có học sinh nào được gán.</p>
//         )}
//       </div>

//       {/* Báo cáo */}
//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//           <AlertTriangle size={20} /> Báo cáo sự cố
//         </h3>
//         <button
//           onClick={handleReportIssue}
//           className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//         >
//           Gửi báo cáo
//         </button>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useMemo } from "react";
import { 
  Navigation, Users, MapPin, CheckCircle, 
  Circle, Play, AlertTriangle 
} from "lucide-react";
import io from "socket.io-client";
import { useAuth } from "../../contexts/AuthContext";
import MapView from "../../views/common/MapView"; 

// --- MOCK DATA (Dữ liệu giả lập cho Tuyến đường & Học sinh) ---
// Trong thực tế, bạn sẽ lấy dữ liệu này từ API dựa trên Schedule ID
const MOCK_ROUTE_STOPS = [
  { id: 1, name: "Trạm 1: Chung cư Sunrise City", lat: 10.762622, lng: 106.660172, status: 'pending', eta: '06:30' },
  { id: 2, name: "Trạm 2: Vivo City", lat: 10.772622, lng: 106.670172, status: 'pending', eta: '06:45' },
  { id: 3, name: "Trạm 3: Trường Quốc Tế ABC", lat: 10.782622, lng: 106.680172, status: 'pending', eta: '07:00' }
];

const MOCK_STUDENTS_BY_STOP = [
  { id: "HS01", name: "Nguyễn Văn A", class: "1A", stopId: 1, status: "0", avatar: "A" },
  { id: "HS02", name: "Trần Thị B", class: "2B", stopId: 1, status: "0", avatar: "B" },
  { id: "HS03", name: "Lê Văn C", class: "3C", stopId: 2, status: "0", avatar: "C" },
  { id: "HS04", name: "Phạm Thị D", class: "1A", stopId: 2, status: "0", avatar: "D" },
  { id: "HS05", name: "Hoàng Văn E", class: "5A", stopId: 3, status: "0", avatar: "E" },
];

const socket = io("http://localhost:5000");

// Hàm tính khoảng cách giữa 2 điểm GPS (đơn vị: mét)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999999;
  const R = 6371e3; // Bán kính trái đất (mét)
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; 
};

export default function DriverTracking() {
  const { user } = useAuth();
  
  // --- State Quản lý ---
  const [currentPosition, setCurrentPosition] = useState(null); // Vị trí xe hiện tại
  const [isTracking, setIsTracking] = useState(false); // Trạng thái bắt đầu chuyến đi
  
  // State quản lý tuyến đường & trạm dừng
  const [stops, setStops] = useState(MOCK_ROUTE_STOPS);
  const [currentStopIndex, setCurrentStopIndex] = useState(0); // Index trạm đang hướng tới
  const [isAtStop, setIsAtStop] = useState(false); // Xe đã đến trạm chưa?
  
  // State quản lý học sinh
  const [students, setStudents] = useState(MOCK_STUDENTS_BY_STOP);

  // --- Logic 1: Theo dõi GPS & Tự động phát hiện trạm ---
  useEffect(() => {
    if (!isTracking) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });

        // Gửi socket realtime về server
        socket.emit("driverLocation", {
          driverId: user?.id,
          lat: latitude,
          lng: longitude
        });

        // Tự động kiểm tra khoảng cách tới trạm tiếp theo
        if (currentStopIndex < stops.length && !isAtStop) {
          const targetStop = stops[currentStopIndex];
          const distance = calculateDistance(latitude, longitude, targetStop.lat, targetStop.lng);
          
          // Nếu khoảng cách < 100m -> Tự động xác nhận đã đến trạm
          if (distance < 100) {
             handleArriveAtStop();
          }
        }
      },
      (err) => console.error("Lỗi GPS:", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isTracking, currentStopIndex, isAtStop, stops, user]);

  // --- Logic 2: Xử lý hành động ---
  
  // Khi xe đến trạm (Tự động hoặc bấm nút thủ công)
  const handleArriveAtStop = () => {
    setIsAtStop(true);
    // Cập nhật trạng thái trạm thành "arrived" (màu vàng)
    setStops(prev => prev.map((s, i) => i === currentStopIndex ? { ...s, status: 'arrived' } : s));
    // Phát âm thanh hoặc rung (nếu cần)
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  };

  // Khi đón xong và rời trạm
  const handleDepartStop = () => {
    // 1. Cập nhật trạm hiện tại thành "completed" (màu xanh)
    setStops(prev => prev.map((s, i) => i === currentStopIndex ? { ...s, status: 'completed' } : s));
    
    // 2. Chuyển sang trạm kế tiếp
    if (currentStopIndex < stops.length - 1) {
      setCurrentStopIndex(prev => prev + 1);
      setIsAtStop(false);
    } else {
      alert("Đã hoàn thành tất cả các trạm của lộ trình!");
      setIsTracking(false);
      setIsAtStop(false);
    }
  };

  // Điểm danh học sinh
  const toggleStudentStatus = (studentId) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      // Toggle logic: 0 (Chưa đón) -> 1 (Đã đón) -> 0
      const newStatus = s.status === "1" ? "0" : "1";
      // Gửi API update ở đây (nếu có backend)
      return { ...s, status: newStatus };
    }));
  };

  // --- Helper: Lọc học sinh tại trạm hiện tại ---
  const currentStopStudents = useMemo(() => {
    if (currentStopIndex >= stops.length) return [];
    const currentStopId = stops[currentStopIndex].id;
    return students.filter(s => s.stopId === currentStopId);
  }, [students, currentStopIndex, stops]);

  const pickedUpCount = currentStopStudents.filter(s => s.status === "1").length;

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-4">
      
      {/* CỘT TRÁI: BẢN ĐỒ (Chiếm 60% trên màn lớn) */}
      <div className="w-full md:w-3/5 h-[400px] md:h-full flex flex-col gap-4">
        {/* Header Map */}
        <div className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
            <div>
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Navigation className="text-blue-600" size={20}/> Bản đồ lộ trình
              </h2>
              {isTracking && stops[currentStopIndex] && (
                <p className="text-sm text-blue-600 mt-1">
                  Đang hướng đến: <span className="font-bold">{stops[currentStopIndex].name}</span>
                </p>
              )}
            </div>
            <button 
              onClick={() => setIsTracking(!isTracking)}
              className={`px-4 py-2 rounded-lg font-bold text-white shadow-md transition-all ${isTracking ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {isTracking ? "Dừng theo dõi" : "Bắt đầu chạy"}
            </button>
        </div>

        {/* Map View */}
        <div className="flex-1 bg-gray-200 rounded-xl overflow-hidden shadow-inner border border-gray-300 relative">
          <MapView 
            title="Driver Location"
            position={currentPosition}
            user={user}
            // Truyền thêm props nếu MapView hỗ trợ hiển thị markers các trạm
            stops={stops} 
          />
          
          {/* Nút giả lập (dành cho test khi ngồi yên 1 chỗ) */}
          {isTracking && !isAtStop && (
            <div className="absolute bottom-4 right-4 z-[1000]">
               <button 
                  onClick={handleArriveAtStop}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg font-medium text-sm"
               >
                  (Test) Giả lập đến trạm
               </button>
            </div>
          )}
        </div>
      </div>

      {/* CỘT PHẢI: THÔNG TIN TRẠM & HỌC SINH (Chiếm 40%) */}
      <div className="w-full md:w-2/5 flex flex-col gap-4 h-full overflow-hidden">
        
        {/* CASE 1: ĐANG DI CHUYỂN (Hiển thị danh sách các trạm) */}
        {!isAtStop ? (
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
             <div className="p-4 bg-gray-50 border-b">
               <h3 className="font-bold text-gray-800">Lộ trình chuyến đi</h3>
               <p className="text-xs text-gray-500">Danh sách các điểm dừng sắp tới</p>
             </div>
             
             <div className="overflow-y-auto p-4 space-y-6">
                {stops.map((stop, index) => {
                  const isPast = index < currentStopIndex;
                  const isCurrent = index === currentStopIndex;
                  
                  return (
                    <div key={stop.id} className="relative pl-8">
                      {/* Đường kẻ nối */}
                      {index !== stops.length - 1 && (
                        <div className={`absolute left-[11px] top-7 w-0.5 h-full ${isPast ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      )}
                      
                      {/* Icon trạng thái */}
                      <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 z-10 bg-white
                        ${isPast ? 'border-green-500 text-green-500' : isCurrent ? 'border-blue-500 text-blue-500 animate-pulse' : 'border-gray-300 text-gray-300'}`}>
                        {isPast ? <CheckCircle size={14} fill="currentColor" className="text-white"/> : <Circle size={10} fill="currentColor"/>}
                      </div>

                      {/* Thông tin trạm */}
                      <div className={`${isCurrent ? 'opacity-100' : 'opacity-60'}`}>
                        <h4 className={`text-sm font-bold ${isCurrent ? 'text-blue-700' : 'text-gray-800'}`}>{stop.name}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">ETA: {stop.eta}</span>
                          {isCurrent && <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">Đang đến</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
             </div>
           </div>
        ) : (
        /* CASE 2: ĐÃ ĐẾN TRẠM (Hiển thị danh sách đón học sinh) */
          <div className="bg-white rounded-xl shadow-lg border border-blue-200 flex-1 flex flex-col overflow-hidden relative">
            {/* Header Trạm hiện tại */}
            <div className="p-5 bg-blue-600 text-white">
               <div className="flex items-start justify-between">
                  <div>
                    <div className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">Đang dừng tại</div>
                    <h2 className="text-xl font-bold">{stops[currentStopIndex]?.name}</h2>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg">
                    <MapPin className="text-white" size={24} />
                  </div>
               </div>
               <div className="mt-4 flex items-center justify-between text-sm">
                 <span className="bg-blue-800 px-3 py-1 rounded-full">{pickedUpCount}/{currentStopStudents.length} Đã lên xe</span>
               </div>
            </div>

            {/* Danh sách học sinh cần đón */}
            <div className="flex-1 overflow-y-auto p-2 bg-gray-50">
               {currentStopStudents.length === 0 ? (
                 <div className="text-center py-10 text-gray-400">Không có học sinh nào ở trạm này.</div>
               ) : (
                 <div className="space-y-2">
                   {currentStopStudents.map((std) => {
                     const isPicked = std.status === "1";
                     return (
                       <div 
                         key={std.id} 
                         onClick={() => toggleStudentStatus(std.id)}
                         className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between group
                           ${isPicked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-blue-300'}`}
                       >
                         <div className="flex items-center gap-3">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${isPicked ? 'bg-green-500' : 'bg-gray-400'}`}>
                             {std.avatar}
                           </div>
                           <div>
                             <div className={`font-bold ${isPicked ? 'text-green-800' : 'text-gray-800'}`}>{std.name}</div>
                             <div className="text-xs text-gray-500">Lớp {std.class} • ID: {std.id}</div>
                           </div>
                         </div>
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isPicked ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-300 group-hover:bg-blue-100 group-hover:text-blue-500'}`}>
                           <CheckCircle size={20} />
                         </div>
                       </div>
                     );
                   })}
                 </div>
               )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-white border-t border-gray-100 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
               <button 
                 onClick={handleDepartStop}
                 className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
               >
                 Tiếp tục hành trình <Play size={20} fill="currentColor"/>
               </button>
               {pickedUpCount < currentStopStudents.length && (
                 <p className="text-center text-xs text-orange-500 mt-2 flex items-center justify-center gap-1">
                   <AlertTriangle size={12}/> Chú ý: Còn {currentStopStudents.length - pickedUpCount} học sinh chưa lên xe
                 </p>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}