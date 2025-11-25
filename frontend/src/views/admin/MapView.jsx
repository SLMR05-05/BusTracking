import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Users, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper function to format date
const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '';
  try {
    if (dateStr.includes('T')) {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  } catch (error) {
    return dateStr;
  }
};

export default function AdminMapView() {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  
  const [schedule, setSchedule] = useState(null);
  const [stops, setStops] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [scheduleId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch schedule details
      const scheduleRes = await axios.get(`${API_BASE_URL}/schedules/${scheduleId}/details`, config);
      const scheduleInfoRes = await axios.get(`${API_BASE_URL}/schedules`, config);
      
      const scheduleInfo = scheduleInfoRes.data.find(s => s.MaLT === parseInt(scheduleId));
      
      if (!scheduleInfo) {
        setLoading(false);
        return;
      }
      
      setSchedule(scheduleInfo);

      // Process stops
      const processedStops = scheduleRes.data.map(stop => ({
        id: stop.MaTram,
        name: stop.TenTram,
        address: stop.DiaChi,
        lat: parseFloat(stop.ViDo),
        lng: parseFloat(stop.KinhDo),
        order: stop.ThuTu,
        status: stop.TrangThaiQua === '1' ? 'completed' : 'pending'
      })).sort((a, b) => a.order - b.order);

      setStops(processedStops);

      // Fetch attendance
      const attendanceRes = await axios.get(`${API_BASE_URL}/attendance/schedule/${scheduleId}`, config);
      const sortedAttendance = attendanceRes.data.sort((a, b) => {
        if (a.ThuTu && b.ThuTu) return a.ThuTu - b.ThuTu;
        return 0;
      });
      setAttendance(sortedAttendance);

    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || stops.length === 0) return;

    const map = L.map(mapRef.current).setView([stops[0].lat, stops[0].lng], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    mapInstanceRef.current = map;

    const routeCoords = stops.map(stop => [stop.lat, stop.lng]);
    const polyline = L.polyline(routeCoords, {
      color: '#3b82f6',
      weight: 4,
      opacity: 0.7,
    }).addTo(map);

    map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

    stops.forEach((stop, index) => {
      const isFirst = index === 0;
      const isLast = index === stops.length - 1;
      const isPassed = stop.status === 'completed';
      
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="width:40px;height:40px;background:${isFirst ? '#10b981' : isLast ? '#ef4444' : isPassed ? '#10b981' : '#3b82f6'};border:3px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;box-shadow:0 2px 8px rgba(0,0,0,0.3);">${stop.order}</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const studentsAtStop = attendance.filter(a => a.MaTram === stop.id);
      const completedCount = studentsAtStop.filter(s => s.TrangThai === '2').length;

      L.marker([stop.lat, stop.lng], { icon })
        .addTo(map)
        .bindPopup(`<div style="min-width:200px;"><h3 style="font-weight:bold;margin-bottom:8px;">${stop.name}</h3><p style="font-size:12px;color:#666;">${stop.address}</p><p style="font-size:12px;color:#666;">👥 ${completedCount}/${studentsAtStop.length} đã điểm danh</p></div>`);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [stops, attendance]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white border-b p-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/schedule')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">{schedule?.TenTuyenDuong}</h1>
            <p className="text-sm text-gray-600">
              {formatDateDisplay(schedule?.NgayChay)} • {schedule?.GioBatDau?.substring(0, 5)} - {schedule?.GioKetThuc?.substring(0, 5)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1">
          <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
        </div>

        <div className="w-96 bg-white border-l overflow-y-auto">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-bold flex items-center gap-2">
              <Users size={20} /> Danh sách điểm danh
            </h2>
          </div>

          {stops.map(stop => {
            const studentsAtStop = attendance.filter(a => a.MaTram === stop.id);
            if (studentsAtStop.length === 0) return null;

            const completedCount = studentsAtStop.filter(s => s.TrangThai === '2').length;

            return (
              <div key={stop.id} className="border-b">
                <div className="p-4 bg-blue-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-600" />
                    <h3 className="font-semibold">{stop.name}</h3>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {completedCount}/{studentsAtStop.length}
                  </span>
                </div>

                <div className="divide-y">
                  {studentsAtStop.map(student => {
                    const statusMap = {
                      '0': { text: 'Chưa đón', color: 'bg-gray-100 text-gray-800' },
                      '1': { text: 'Đã đón', color: 'bg-blue-100 text-blue-800' },
                      '2': { text: 'Đã trả', color: 'bg-green-100 text-green-800' }
                    };
                    const status = statusMap[student.TrangThai] || statusMap['0'];

                    return (
                      <div key={student.MaDD} className="p-3 flex justify-between hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            student.TrangThai === '2' ? 'bg-green-500' : 'bg-gray-400'
                          }`}>
                            {student.TenHS?.charAt(0) || 'H'}
                          </div>
                          <div>
                            <div className="font-medium">{student.TenHS}</div>
                            <div className="text-xs text-gray-500">Lớp {student.Lop}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
                            {status.text}
                          </span>
                          {student.ThoiGian && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock size={10} />
                              {new Date(student.ThoiGian).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
