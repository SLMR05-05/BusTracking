import React, { useState, useEffect, useMemo } from "react";
import { 
  ChevronLeft, ChevronRight, Calendar, Clock, 
  MapPin, User, Users, X, Bus, Navigation 
} from "lucide-react";

// --- HELPERS XỬ LÝ NGÀY THÁNG (Không cần thư viện ngoài) ---
const getMonday = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); 
  return new Date(date.setDate(diff));
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const formatDate = (date) => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

const formatVNTime = (date) => {
  return new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' }).format(date);
};

// --- MOCK DATA (Sinh dữ liệu giả lập theo tuần hiện tại) ---
const generateMockSchedule = (baseDate) => {
  const monday = getMonday(baseDate);
  // Tạo dữ liệu cho Thứ 2, Thứ 4, Thứ 6
  return [
    {
      id: "trip-1",
      date: formatDate(monday), // Thứ 2
      route: "Tuyến 1: Quận 7 - Quận 1",
      busCode: "51B-123.45",
      startTime: "06:30",
      endTime: "07:30",
      status: "completed",
      driver: "Trần Văn Tài",
      stops: [
        { name: "Chung cư Sunrise City", time: "06:30", type: "pickup" },
        { name: "Lotte Mart Q7", time: "06:45", type: "pickup" },
        { name: "Trường THPT Lê Quý Đôn", time: "07:30", type: "dropoff" },
      ]
    },
    {
      id: "trip-2",
      date: formatDate(monday), // Thứ 2 (Chuyến chiều)
      route: "Tuyến 1: Quận 1 - Quận 7",
      busCode: "51B-123.45",
      startTime: "16:30",
      endTime: "17:30",
      status: "pending",
      driver: "Trần Văn Tài",
      stops: [
        { name: "Trường THPT Lê Quý Đôn", time: "16:30", type: "pickup" },
        { name: "Lotte Mart Q7", time: "17:15", type: "dropoff" },
        { name: "Chung cư Sunrise City", time: "17:30", type: "dropoff" },
      ]
    },
    {
      id: "trip-3",
      date: formatDate(addDays(monday, 2)), // Thứ 4
      route: "Tuyến 3: Bình Thạnh - Q1",
      busCode: "59Z-999.99",
      startTime: "06:00",
      endTime: "07:00",
      status: "pending",
      driver: "Trần Văn Tài",
      stops: [
        { name: "Vinhomes Central Park", time: "06:00", type: "pickup" },
        { name: "Sài Gòn Pearl", time: "06:15", type: "pickup" },
        { name: "Trường Wellspring", time: "07:00", type: "dropoff" },
      ]
    },
     {
      id: "trip-4",
      date: formatDate(addDays(monday, 4)), // Thứ 6
      route: "Tuyến Ngoại Khóa: Thảo Cầm Viên",
      busCode: "51B-888.88",
      startTime: "08:00",
      endTime: "11:00",
      status: "pending",
      driver: "Trần Văn Tài",
      stops: [
        { name: "Trường Quốc Tế ABC", time: "08:00", type: "pickup" },
        { name: "Thảo Cầm Viên Sài Gòn", time: "08:45", type: "dropoff" },
        { name: "Trường Quốc Tế ABC", time: "11:00", type: "dropoff" },
      ]
    }
  ];
};

export default function DriverSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Load dữ liệu khi đổi tuần (Ở thực tế sẽ gọi API based on startDate & endDate)
  useEffect(() => {
    // Giả lập fetch API
    const data = generateMockSchedule(currentDate);
    setTrips(data);
  }, [currentDate]);

  // Tạo mảng 7 ngày trong tuần hiện tại
  const weekDays = useMemo(() => {
    const monday = getMonday(currentDate);
    return Array.from({ length: 7 }).map((_, i) => addDays(monday, i));
  }, [currentDate]);

  // Điều hướng tuần
  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));
  const goToday = () => setCurrentDate(new Date());

  // Lấy danh sách trip của một ngày cụ thể
  const getTripsForDay = (dateObj) => {
    const dateStr = formatDate(dateObj);
    return trips.filter(t => t.date === dateStr).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const isToday = (dateObj) => formatDate(dateObj) === formatDate(new Date());

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen font-sans">
      
      {/* --- HEADER ĐIỀU HƯỚNG --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="text-blue-600" /> Thời Khóa Biểu
          </h1>
          <p className="text-gray-500 text-sm">Quản lý lịch trình chạy xe hàng tuần</p>
        </div>

        <div className="flex items-center bg-white rounded-lg shadow-sm border p-1">
          <button onClick={prevWeek} className="p-2 hover:bg-gray-100 rounded-md text-gray-600">
            <ChevronLeft size={20} />
          </button>
          <div className="px-4 font-semibold text-gray-700 w-48 text-center select-none">
            {`Tuần ${weekDays[0].getDate()}/${weekDays[0].getMonth() + 1} - ${weekDays[6].getDate()}/${weekDays[6].getMonth() + 1}`}
          </div>
          <button onClick={nextWeek} className="p-2 hover:bg-gray-100 rounded-md text-gray-600">
            <ChevronRight size={20} />
          </button>
        </div>
        
        <button onClick={goToday} className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors border border-blue-200">
          Về hôm nay
        </button>
      </div>

      {/* --- LỊCH TRÌNH GRID (WEEK VIEW) --- */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const dayTrips = getTripsForDay(day);
          const isCurrentDay = isToday(day);

          return (
            <div key={index} className={`flex flex-col rounded-xl overflow-hidden border transition-all 
              ${isCurrentDay ? 'bg-blue-50/50 border-blue-200 shadow-md ring-1 ring-blue-200' : 'bg-white border-gray-200 shadow-sm'}`}
            >
              {/* Header Ngày */}
              <div className={`p-3 text-center border-b ${isCurrentDay ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-600'}`}>
                <div className="text-xs font-semibold uppercase opacity-70">
                  {new Intl.DateTimeFormat('vi-VN', { weekday: 'short' }).format(day)}
                </div>
                <div className={`text-xl font-bold mt-1 w-8 h-8 mx-auto flex items-center justify-center rounded-full ${isCurrentDay ? 'bg-blue-600 text-white' : ''}`}>
                  {day.getDate()}
                </div>
              </div>

              {/* Danh sách chuyến trong ngày */}
              <div className="flex-1 p-2 min-h-[150px] space-y-2">
                {dayTrips.length > 0 ? (
                  dayTrips.map(trip => (
                    <div 
                      key={trip.id}
                      onClick={() => setSelectedTrip(trip)}
                      className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider
                          ${trip.status === 'completed' ? 'bg-green-100 text-green-700' : 
                            trip.status === 'on-trip' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                          {trip.status === 'completed' ? 'Đã xong' : trip.status === 'on-trip' ? 'Đang chạy' : 'Sắp tới'}
                        </span>
                        <div className="text-gray-400 group-hover:text-blue-500">
                           <Navigation size={14} />
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-gray-800 text-sm line-clamp-2 leading-tight mb-2">
                        {trip.route}
                      </h3>
                      
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{trip.startTime} - {trip.endTime}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-300 text-xs italic">
                    Trống lịch
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- MODAL CHI TIẾT --- */}
      {selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="bg-blue-600 p-5 text-white flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Bus size={20} /> {selectedTrip.route}
                </h2>
                <p className="text-blue-100 text-sm mt-1 flex items-center gap-4">
                  <span>📅 {selectedTrip.date}</span>
                  <span>🚐 {selectedTrip.busCode}</span>
                </p>
              </div>
              <button 
                onClick={() => setSelectedTrip(null)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              
              <div className="flex justify-between items-center mb-6 bg-gray-50 p-3 rounded-lg border">
                 <div className="text-center">
                    <div className="text-xs text-gray-500 uppercase">Khởi hành</div>
                    <div className="font-bold text-xl text-blue-600">{selectedTrip.startTime}</div>
                 </div>
                 <div className="h-px bg-gray-300 flex-1 mx-4 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 bg-gray-50 px-2 text-xs">
                        Thời gian dự kiến
                    </div>
                 </div>
                 <div className="text-center">
                    <div className="text-xs text-gray-500 uppercase">Kết thúc</div>
                    <div className="font-bold text-xl text-gray-800">{selectedTrip.endTime}</div>
                 </div>
              </div>

              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-red-500"/> Lộ trình chi tiết
              </h3>

              {/* Timeline Các trạm */}
              <div className="space-y-0 relative pl-2">
                {selectedTrip.stops.map((stop, index) => (
                  <div key={index} className="flex gap-4 relative pb-8 last:pb-0 group">
                    {/* Vertical Line */}
                    {index !== selectedTrip.stops.length - 1 && (
                      <div className="absolute left-[7px] top-3 bottom-0 w-0.5 bg-gray-200 group-hover:bg-blue-200 transition-colors"></div>
                    )}
                    
                    {/* Dot */}
                    <div className={`relative z-10 w-4 h-4 rounded-full border-2 mt-1.5 shrink-0
                      ${stop.type === 'pickup' ? 'border-green-500 bg-green-100' : 'border-red-500 bg-red-100'}`}>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="font-semibold text-gray-800 text-sm">{stop.name}</div>
                        <span className="text-xs font-mono font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          {stop.time}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        {stop.type === 'pickup' ? 'Đón học sinh' : 'Trả học sinh'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Driver Info Block */}
              <div className="mt-8 pt-4 border-t flex items-center gap-3">
                 <div className="bg-gray-100 p-2 rounded-full">
                    <User size={20} className="text-gray-600"/>
                 </div>
                 <div>
                    <div className="text-xs text-gray-500">Tài xế phụ trách</div>
                    <div className="font-medium text-sm">{selectedTrip.driver}</div>
                 </div>
                 <button className="ml-auto text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-medium hover:bg-blue-100">
                    Xem hồ sơ
                 </button>
              </div>

            </div>
            
            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
               <button 
                  onClick={() => setSelectedTrip(null)}
                  className="px-4 py-2 text-gray-600 text-sm font-medium hover:bg-gray-200 rounded-lg transition-colors"
               >
                 Đóng
               </button>
               <button 
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-md transition-colors flex items-center gap-2"
                  onClick={() => alert("Chuyển đến màn hình theo dõi GPS")}
               >
                 <Navigation size={16}/> Bắt đầu chạy
               </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}