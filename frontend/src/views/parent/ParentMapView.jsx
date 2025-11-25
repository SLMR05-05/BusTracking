import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RouteMap from '../../components/RouteMap';

const API_URL = 'http://localhost:5000/api';

export default function ParentMapView() {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScheduleData();
  }, [scheduleId]);

  const fetchScheduleData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Lấy thông tin lịch trình
      const scheduleRes = await axios.get(
        `${API_URL}/driver-dashboard/schedules/${scheduleId}`,
        config
      );
      setSchedule(scheduleRes.data);

      // Lấy danh sách trạm
      const stopsRes = await axios.get(
        `${API_URL}/driver-dashboard/schedules/${scheduleId}/stops`,
        config
      );

      // Xử lý dữ liệu trạm
      const processedStops = stopsRes.data.map(stop => ({
        id: stop.MaTram,
        detailId: stop.MaCTLT,
        name: stop.TenTram,
        address: stop.DiaChi,
        lat: parseFloat(stop.ViDo),
        lng: parseFloat(stop.KinhDo),
        order: stop.ThuTu,
        status: stop.TrangThaiQua === '1' ? 'completed' : 'pending'
      }));

      // Sắp xếp theo thứ tự
      processedStops.sort((a, b) => a.order - b.order);
      
      setStops(processedStops);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching schedule data:', error);
      setLoading(false);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const timePart = timeString.split('T')[1] || timeString;
    return timePart.substring(0, 5);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getScheduleStatus = () => {
    if (!schedule) return { text: 'Không xác định', color: 'gray' };
    if (schedule.TrangThai === 'completed') return { text: 'Đã hoàn thành', color: 'green' };
    if (schedule.TrangThai === 'running') return { text: 'Đang chạy', color: 'blue' };
    return { text: 'Chưa bắt đầu', color: 'orange' };
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
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-700 mb-4">Không tìm thấy lịch trình</p>
          <button
            onClick={() => navigate('/parent-dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const status = getScheduleStatus();
  const currentStopIndex = stops.findIndex(s => s.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/parent-dashboard')}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              ← Quay lại
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Làm mới
            </button>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900">Bản đồ lộ trình</h1>
          <p className="text-gray-600 mt-1">{schedule.TenTuyenDuong}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Thông tin lịch trình */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                Thông tin chuyến xe
              </h2>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Xe buýt:</span>
                  <span className="ml-2">{schedule.BienSo}</span>
                </div>
                <div>
                  <span className="font-medium">Tài xế:</span>
                  <span className="ml-2">{schedule.TenTX}</span>
                </div>
                <div>
                  <span className="font-medium">Thời gian:</span>
                  <span className="ml-2">
                    {formatTime(schedule.GioBatDau)} - {formatTime(schedule.GioKetThuc)}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Ngày:</span>
                  <span className="ml-2">{formatDate(schedule.NgayChay)}</span>
                </div>
              </div>
            </div>
            
            <span
              className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap ${
                status.color === 'green' ? 'bg-green-100 text-green-700' :
                status.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                'bg-orange-100 text-orange-700'
              }`}
            >
              {status.text}
            </span>
          </div>
        </div>

        {/* Bản đồ */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900">Bản đồ lộ trình</h2>
            <p className="text-sm text-gray-600 mt-1">
              Đường đi thực tế với {stops.length} trạm
            </p>
          </div>
          <div className="h-[600px]">
            <RouteMap 
              stops={stops}
              currentPosition={null}
            />
          </div>
        </div>

        {/* Danh sách trạm */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="text-lg font-bold text-gray-900">Danh sách trạm</h2>
            <p className="text-sm text-gray-600 mt-1">
              Thứ tự các trạm trên lộ trình
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stops.map((stop, index) => {
                const isPassed = stop.status === 'completed';
                const isCurrent = index === currentStopIndex;
                
                return (
                  <div key={stop.id} className="relative pl-8">
                    {index !== stops.length - 1 && (
                      <div className={`absolute left-[11px] top-6 w-0.5 h-full ${
                        isPassed ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                    )}
                    
                    <div className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center z-10 bg-white border-2 ${
                      isPassed ? 'border-green-500' : 
                      isCurrent ? 'border-blue-500' : 
                      'border-gray-300'
                    }`}>
                      {isPassed && (
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      )}
                      {isCurrent && (
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium text-sm ${
                          isCurrent ? 'text-blue-700' : 'text-gray-900'
                        }`}>
                          {stop.order}. {stop.name}
                        </h4>
                        {isCurrent && (
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            Đang đến
                          </span>
                        )}
                        {isPassed && (
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                            Đã qua
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {stop.address}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
