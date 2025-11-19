import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Plus, Route, Trash2, MapPin, Eye, CheckCircle, Search, X, Map as MapIcon } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const API_URL = 'http://localhost:5000/api';

// Helper function to parse dd-mm-yyyy format
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  
  // If already in yyyy-mm-dd format
  if (dateStr.includes('-') && dateStr.split('-')[0].length === 4) {
    return dateStr;
  }
  
  // Parse dd-mm-yyyy format
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  return dateStr;
};

// Helper function to format date for display (dd/mm/yyyy)
const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '';
  
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      // Check if it's yyyy-mm-dd format (year is 4 digits)
      if (parts[0].length === 4) {
        const [year, month, day] = parts;
        const date = new Date(year, parseInt(month) - 1, parseInt(day));
        return date.toLocaleDateString('vi-VN');
      }
      // Otherwise it's dd-mm-yyyy format
      else {
        const [day, month, year] = parts;
        const date = new Date(year, parseInt(month) - 1, parseInt(day));
        return date.toLocaleDateString('vi-VN');
      }
    }
    
    // Fallback to standard parsing
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('vi-VN');
    }
    return dateStr;
  } catch (error) {
    return dateStr;
  }
};

// Helper function to convert yyyy-mm-dd to dd-mm-yyyy for backend
const formatDateForBackend = (dateStr) => {
  if (!dateStr) return '';
  
  const parts = dateStr.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
  }
  
  return dateStr;
};

export default function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [searchDate, setSearchDate] = useState('');
  const [selectedScheduleIds, setSelectedScheduleIds] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [activeTab, setActiveTab] = useState('stations');
  
  // Map ref for detail modal with auto-refresh
  const detailMapRef = useRef(null);
  const detailMapInstanceRef = useRef(null);
  const mapRefreshIntervalRef = useRef(null);
  
  const [formData, setFormData] = useState({
    MaTD: '', MaTX: '', MaXB: '', GioBatDau: '', GioKetThuc: ''
  });
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedStops, setSelectedStops] = useState([]);
  const [availableStops, setAvailableStops] = useState([]);

  // Fetch data on mount
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (isMounted) {
        await fetchAllData();
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      console.log('Fetching data from API...');

      const [schedulesRes, driversRes, busesRes, routesRes] = await Promise.all([
        fetch(`${API_URL}/schedules`, { headers }),
        fetch(`${API_URL}/drivers`, { headers }),
        fetch(`${API_URL}/buses`, { headers }),
        fetch(`${API_URL}/routes`, { headers })
      ]);

      console.log('Response status:', {
        schedules: schedulesRes.status,
        drivers: driversRes.status,
        buses: busesRes.status,
        routes: routesRes.status
      });

      if (!schedulesRes.ok) {
        console.error('Schedules API error:', await schedulesRes.text());
      }
      if (!driversRes.ok) {
        console.error('Drivers API error:', await driversRes.text());
      }
      if (!busesRes.ok) {
        console.error('Buses API error:', await busesRes.text());
      }
      if (!routesRes.ok) {
        console.error('Routes API error:', await routesRes.text());
      }

      const schedulesData = schedulesRes.ok ? await schedulesRes.json() : [];
      const driversData = driversRes.ok ? await driversRes.json() : [];
      const busesData = busesRes.ok ? await busesRes.json() : [];
      const routesData = routesRes.ok ? await routesRes.json() : [];

      console.log('Fetched data:', {
        schedules: schedulesData.length,
        drivers: driversData.length,
        buses: busesData.length,
        routes: routesData.length
      });

      // Fetch details for each schedule
      const schedulesWithDetails = await Promise.all(
        schedulesData.map(async (schedule) => {
          try {
            const detailsRes = await fetch(`${API_URL}/schedules/${schedule.MaLT}/details`, { headers });
            const details = detailsRes.ok ? await detailsRes.json() : [];
            return { ...schedule, details };
          } catch (err) {
            console.error(`Error fetching details for schedule ${schedule.MaLT}:`, err);
            return { ...schedule, details: [] };
          }
        })
      );

      setSchedules(schedulesWithDetails);
      setDrivers(driversData);
      setBuses(busesData);
      setRoutes(routesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Lỗi khi tải dữ liệu! Kiểm tra console để biết chi tiết.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance data
  const fetchAttendance = async (scheduleId) => {
    try {
      setLoadingAttendance(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/attendance/schedule/${scheduleId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAttendanceList(data);
      } else {
        console.error('Error fetching attendance:', await response.text());
        setAttendanceList([]);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setAttendanceList([]);
    } finally {
      setLoadingAttendance(false);
    }
  };

  // Handlers
  const handleRouteChange = async (routeId) => {
    setFormData({ ...formData, MaTD: routeId });
    
    if (!routeId) {
      setAvailableStops([]);
      setSelectedStops([]);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/routes/${routeId}/stops`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const stops = await response.json();
      setAvailableStops(stops);
      // Tự động chọn tất cả trạm của tuyến (đã được sắp xếp theo ThuTu)
      setSelectedStops(stops);
    } catch (error) {
      console.error('Error fetching route stops:', error);
      setAvailableStops([]);
      setSelectedStops([]);
    }
  };



  const handleAddDateRange = () => {
    const from = document.getElementById('fromDate').value;
    const to = document.getElementById('toDate').value;
    if (!from || !to) return alert('Vui lòng chọn cả ngày bắt đầu và kết thúc!');
    
    const start = new Date(from);
    const end = new Date(to);
    if (start > end) return alert('Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc!');
    
    const dates = [];
    const current = new Date(start);
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      if (!selectedDates.includes(dateStr)) dates.push(dateStr);
      current.setDate(current.getDate() + 1);
    }
    
    setSelectedDates([...selectedDates, ...dates].sort());
    document.getElementById('fromDate').value = '';
    document.getElementById('toDate').value = '';
  };

  const handleRemoveDate = (date) => {
    setSelectedDates(selectedDates.filter(d => d !== date));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.MaTD) {
      alert('Vui lòng chọn tuyến đường!');
      return;
    }
    
    if (availableStops.length === 0) {
      alert('Tuyến đường này chưa có trạm! Vui lòng thêm trạm trong trang "Tuyến đường".');
      return;
    }
    
    if (selectedDates.length === 0) {
      alert('Vui lòng chọn ít nhất 1 ngày!');
      return;
    }

    // Validate time
    if (formData.GioBatDau >= formData.GioKetThuc) {
      alert('Giờ bắt đầu phải nhỏ hơn giờ kết thúc!');
      return;
    }

    // Kiểm tra conflict sẽ được thực hiện ở backend

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Create new schedules for each selected date
        let successCount = 0;
        for (let i = 0; i < selectedDates.length; i++) {
          const date = selectedDates[i];
          
          // Generate unique MaLT with proper format (max 50 chars)
          const timestamp = Date.now().toString().slice(-8); // Last 8 digits
          const random = Math.random().toString(36).substr(2, 5); // 5 random chars
          const scheduleData = {
            MaLT: `LT${timestamp}${random}`,
            MaTD: formData.MaTD,
            MaTX: formData.MaTX, // Keep as string, don't convert to int
            MaXB: formData.MaXB,
            NgayChay: formatDateForBackend(date),
            GioBatDau: formData.GioBatDau,
            GioKetThuc: formData.GioKetThuc,
            TrangThai: 'pending'
          };

          console.log('Creating schedule:', scheduleData);

          const response = await fetch(`${API_URL}/schedules`, {
            method: 'POST',
            headers,
            body: JSON.stringify(scheduleData)
          });

          if (response.ok) {
            successCount++;
            // Add schedule details
            for (let j = 0; j < selectedStops.length; j++) {
              const stop = selectedStops[j];
              const detailData = {
                MaCTLT: `CTLT${timestamp}${random}${j}`,
                MaTram: stop.MaTram
              };
              
              console.log('Adding detail:', detailData);
              
              await fetch(`${API_URL}/schedules/${scheduleData.MaLT}/details`, {
                method: 'POST',
                headers,
                body: JSON.stringify(detailData)
              });
            }

            // Tạo điểm danh cho học sinh thuộc các trạm
            try {
              console.log(' Creating attendance for schedule:', scheduleData.MaLT);
              console.log(' API URL:', `${API_URL}/schedules/${scheduleData.MaLT}/attendance`);
              console.log(' Headers:', headers);
              
              const attendanceResponse = await fetch(`${API_URL}/schedules/${scheduleData.MaLT}/attendance`, {
                method: 'POST',
                headers
              });
              
              console.log(' Attendance response status:', attendanceResponse.status);
              
              if (attendanceResponse.ok) {
                const attendanceData = await attendanceResponse.json();
                console.log(' Created attendance:', attendanceData);
              } else {
                const errorText = await attendanceResponse.text();
                console.error('Could not create attendance:', errorText);
              }
            } catch (attendanceError) {
              console.error('Error creating attendance:', attendanceError);
              // Không dừng quá trình tạo lịch trình nếu tạo điểm danh lỗi
            }
          } else {
            const errorData = await response.json();
            console.error('Error creating schedule:', errorData);
            
            // Hiển thị lỗi conflict nếu có
            if (response.status === 400 && errorData.error) {
              alert(`Lỗi ngày ${formatDateDisplay(date)}: ${errorData.error}`);
              break; // Dừng tạo các lịch trình còn lại
            }
          }
          
          // Small delay to ensure unique timestamps
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        alert(`Tạo thành công ${successCount}/${selectedDates.length} lịch trình!`);

      // Refresh data
      await fetchAllData();

      setShowModal(false);
      setFormData({ MaTD: '', MaTX: '', MaXB: '', GioBatDau: '', GioKetThuc: '' });
      setSelectedStops([]);
      setAvailableStops([]);
      setSelectedDates([]);
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Lỗi khi lưu lịch trình!');
    }
  };



  const handleSelectSchedule = (MaLT) => {
    setSelectedScheduleIds(prev => 
      prev.includes(MaLT) ? prev.filter(id => id !== MaLT) : [...prev, MaLT]
    );
  };

  const handleSelectAll = () => {
    const filtered = schedules.filter(s => s.TrangThaiXoa === '0' && (!searchDate || formatDateForBackend(searchDate) === s.NgayChay));
    setSelectedScheduleIds(selectedScheduleIds.length === filtered.length ? [] : filtered.map(s => s.MaLT));
  };

  const handleDeleteSelected = async () => {
    if (selectedScheduleIds.length === 0) return alert('Vui lòng chọn ít nhất 1 lịch trình!');
    if (!window.confirm(`Xóa ${selectedScheduleIds.length} lịch trình?`)) return;

    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      await Promise.all(
        selectedScheduleIds.map(id =>
          fetch(`${API_URL}/schedules/${id}`, { method: 'DELETE', headers })
        )
      );

      alert('Xóa lịch trình thành công!');
      setSelectedScheduleIds([]);
      await fetchAllData();
    } catch (error) {
      console.error('Error deleting schedules:', error);
      alert('Lỗi khi xóa lịch trình!');
    }
  };

  // Auto refresh map data every 5 seconds when map tab is active
  useEffect(() => {
    if (showDetailModal && selectedSchedule && activeTab === 'map') {
      const fetchAndUpdateMap = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_URL}/schedules/${selectedSchedule.MaLT}/details`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok) {
            const details = await response.json();
            
            // Update selected schedule with new details
            setSelectedSchedule(prev => ({
              ...prev,
              details: details
            }));
            
            // Also update in schedules list
            setSchedules(prevSchedules => 
              prevSchedules.map(s => 
                s.MaLT === selectedSchedule.MaLT ? { ...s, details } : s
              )
            );
          }
        } catch (error) {
          console.error('Error fetching schedule details:', error);
        }
      };

      // Fetch immediately
      fetchAndUpdateMap();
      
      // Set up interval to refresh every 5 seconds
      mapRefreshIntervalRef.current = setInterval(fetchAndUpdateMap, 5000);
      
      return () => {
        if (mapRefreshIntervalRef.current) {
          clearInterval(mapRefreshIntervalRef.current);
          mapRefreshIntervalRef.current = null;
        }
      };
    }
  }, [showDetailModal, selectedSchedule?.MaLT, activeTab]);

  // Initialize map for detail modal
  useEffect(() => {
    // Create map when switching to map tab
    if (showDetailModal && activeTab === 'map' && detailMapRef.current && !detailMapInstanceRef.current) {
      const map = L.map(detailMapRef.current).setView([10.7626, 106.6818], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      detailMapInstanceRef.current = map;
    }

    // Cleanup when modal closes or switching away from map tab
    return () => {
      if (detailMapInstanceRef.current && (!showDetailModal || activeTab !== 'map')) {
        detailMapInstanceRef.current.remove();
        detailMapInstanceRef.current = null;
      }
    };
  }, [showDetailModal, activeTab]);

  // Update map markers and routes when data changes
  useEffect(() => {
    const map = detailMapInstanceRef.current;
    if (!map || !selectedSchedule || activeTab !== 'map') return;

    // Clear existing markers and polylines
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    const stations = selectedSchedule.details || [];
    if (stations.length === 0) return;

    // Add station markers
    stations.forEach((station) => {
      const lat = parseFloat(station.ViDo);
      const lng = parseFloat(station.KinhDo);
      
      const isPassed = station.TrangThaiQua === '1';
      const markerColor = isPassed ? '#22c55e' : '#9ca3af';
      
      const stationIcon = L.divIcon({
        className: 'custom-station-marker',
        html: `<div style="background-color: ${markerColor}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); font-size: 14px;">${station.ThuTu}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker([lat, lng], { icon: stationIcon })
        .bindPopup(`<b>${station.TenTram}</b><br>${station.DiaChi}<br><span style="color: ${isPassed ? '#22c55e' : '#9ca3af'};">${isPassed ? '✓ Đã qua' : '○ Chưa qua'}</span>`)
        .addTo(map);
    });

    // Draw route if there are at least 2 stations
    if (stations.length >= 2) {
      // Draw straight lines between stations
      for (let i = 0; i < stations.length - 1; i++) {
        const currentStation = stations[i];
        const nextStation = stations[i + 1];
        const isPassed = currentStation.TrangThaiQua === '1';
        const color = isPassed ? '#22c55e' : '#3b82f6';
        
        L.polyline([
          [parseFloat(currentStation.ViDo), parseFloat(currentStation.KinhDo)],
          [parseFloat(nextStation.ViDo), parseFloat(nextStation.KinhDo)]
        ], { color: color, weight: 5, opacity: 0.8 }).addTo(map);
      }
      
      // Fit bounds only on first load
      const routeCoords = stations.map(s => [parseFloat(s.ViDo), parseFloat(s.KinhDo)]);
      if (routeCoords.length > 0 && !map._boundsSet) {
        map.fitBounds(routeCoords);
        map._boundsSet = true;
      }
    } else if (stations.length === 1) {
      // If only 1 station, just center the map on it
      const station = stations[0];
      if (!map._boundsSet) {
        map.setView([parseFloat(station.ViDo), parseFloat(station.KinhDo)], 15);
        map._boundsSet = true;
      }
    }
  }, [selectedSchedule, activeTab]);



  const filteredSchedules = schedules
    .filter(s => s.TrangThaiXoa === '0' && (!searchDate || formatDateForBackend(searchDate) === s.NgayChay))
    .sort((a, b) => {
      // Tính trạng thái
      const getStatus = (schedule) => {
        const completed = schedule.details?.filter(d => d.TrangThaiQua === '1').length || 0;
        const total = schedule.details?.length || 0;
        if (completed === total && total > 0) return 'completed'; // Hoàn thành
        if (completed > 0 && completed < total) return 'running'; // Đang chạy
        return 'pending'; // Chưa chạy
      };

      const statusA = getStatus(a);
      const statusB = getStatus(b);

      // Thứ tự ưu tiên: Đang chạy > Chưa chạy > Hoàn thành
      const statusOrder = { running: 1, pending: 2, completed: 3 };
      
      if (statusOrder[statusA] !== statusOrder[statusB]) {
        return statusOrder[statusA] - statusOrder[statusB];
      }

      // Cùng trạng thái thì sắp xếp theo ngày gần nhất
      const dateA = parseDate(a.NgayChay);
      const dateB = parseDate(b.NgayChay);
      return new Date(dateA) - new Date(dateB);
    });


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
    
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lịch trình xe buýt</h1>
          <p className="text-gray-600 mt-1">Quản lý lịch trình, trạm dừng và thời gian chạy</p>
        </div>
        <div className="flex gap-3">
          {selectedScheduleIds.length > 0 && (
            <button onClick={handleDeleteSelected} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Trash2 size={20} /> Xóa đã chọn ({selectedScheduleIds.length})
            </button>
          )}
          <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus size={20} /> Tạo lịch trình
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="date" value={searchDate} onChange={(e) => setSearchDate(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {searchDate && (
              <button onClick={() => setSearchDate('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            )}
          </div>
          <div className="text-sm text-gray-600">
            Tìm thấy <span className="font-bold text-blue-600">{filteredSchedules.length}</span> lịch trình
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input type="checkbox" checked={selectedScheduleIds.length === filteredSchedules.length && filteredSchedules.length > 0}
                  onChange={handleSelectAll} className="w-4 h-4 text-blue-600 rounded" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã LT</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày chạy</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tuyến đường</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSchedules.map((schedule) => {
              const completed = schedule.details?.filter(d => d.TrangThaiQua === '1').length || 0;
              const total = schedule.details?.length || 0;
              const isCompleted = completed === total && total > 0;
              const isInProgress = completed > 0 && completed < total;
              
              return (
                <tr key={schedule.MaLT} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input type="checkbox" checked={selectedScheduleIds.includes(schedule.MaLT)}
                      onChange={() => handleSelectSchedule(schedule.MaLT)} className="w-4 h-4 text-blue-600 rounded" />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{schedule.MaLT}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-blue-500" size={16} />
                      <span className="text-sm font-medium text-gray-900">
                        {formatDateDisplay(schedule.NgayChay)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Route className="text-green-500" size={16} />
                      <span className="text-sm font-medium text-gray-900">{schedule.TenTuyenDuong}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <Clock size={14} className="text-gray-400" />
                      {schedule.GioBatDau} - {schedule.GioKetThuc}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {isCompleted ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle size={14} className="mr-1" /> Hoàn thành
                      </span>
                    ) : isInProgress ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Navigation size={14} className="mr-1" /> Đang chạy ({completed}/{total})
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <Clock size={14} className="mr-1" /> Chưa bắt đầu
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button onClick={() => { setSelectedSchedule(schedule); setShowDetailModal(true); }}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                      <Eye size={14} /> Xem chi tiết
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Detail */}
      {showDetailModal && selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-7xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Chi tiết lịch trình {selectedSchedule.MaLT}</h2>
                <p className="text-gray-600 mt-1">{selectedSchedule.TenTuyenDuong} - {formatDateDisplay(selectedSchedule.NgayChay)}</p>
              </div>
              <button onClick={() => { 
                setShowDetailModal(false); 
                setActiveTab('stations');
                if (detailMapInstanceRef.current) {
                  detailMapInstanceRef.current.remove();
                  detailMapInstanceRef.current = null;
                }
              }} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div><p className="text-sm text-gray-600">Tài xế</p><p className="font-medium text-gray-900">{selectedSchedule.TenTX} - {selectedSchedule.SDT}</p></div>
              <div><p className="text-sm text-gray-600">Xe buýt</p><p className="font-medium text-gray-900">{selectedSchedule.MaXB} ({selectedSchedule.BienSo})</p></div>
              <div><p className="text-sm text-gray-600">Giờ bắt đầu</p><p className="font-medium text-gray-900">{selectedSchedule.GioBatDau}</p></div>
              <div><p className="text-sm text-gray-600">Giờ kết thúc</p><p className="font-medium text-gray-900">{selectedSchedule.GioKetThuc}</p></div>
            </div>

            {/* Tabs */}
            <div className="flex border-b mb-4">
              <button 
                onClick={() => setActiveTab('stations')}
                className={`px-4 py-2 font-medium ${activeTab === 'stations' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>
                Danh sách trạm ({selectedSchedule.details?.length || 0})
              </button>
              <button 
                onClick={() => setActiveTab('map')}
                className={`px-4 py-2 font-medium ${activeTab === 'map' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>
                Bản đồ {activeTab === 'map' && <span className="text-xs">( Tự động cập nhật mỗi 5s)</span>}
              </button>
              <button 
                onClick={() => { setActiveTab('attendance'); fetchAttendance(selectedSchedule.MaLT); }}
                className={`px-4 py-2 font-medium ${activeTab === 'attendance' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>
                Điểm danh học sinh
              </button>
            </div>

            {/* Tab Content - Stations */}
            {activeTab === 'stations' && (
              <div className="space-y-4">
                {selectedSchedule.details?.map((detail, index) => (
                  <div key={detail.MaCTLT} className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        detail.TrangThaiQua === '1' ? 'bg-green-500' : 'bg-gray-400'
                      }`}>{detail.ThuTu}</div>
                      {index < (selectedSchedule.details?.length || 0) - 1 && (
                        <div className={`w-1 h-16 ${detail.TrangThaiQua === '1' ? 'bg-green-300' : 'bg-gray-200'}`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{detail.TenTram}</h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <MapPin size={14} /> {detail.DiaChi}
                      </p>
                      <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                        detail.TrangThaiQua === '1' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {detail.TrangThaiQua === '1' ? <><CheckCircle size={12} className="inline mr-1" /> Đã qua</> : 'Chưa qua'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab Content - Map */}
            {activeTab === 'map' && (
              <div className="rounded-lg overflow-hidden border-2 border-gray-300">
                <div ref={detailMapRef} style={{ height: '500px', width: '100%' }}></div>
              </div>
            )}

            {/* Tab Content - Attendance */}
            {activeTab === 'attendance' && (
              <div>
                {loadingAttendance ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
                  </div>
                ) : attendanceList.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">STT</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên học sinh</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lớp</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạm</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {attendanceList.map((attendance, index) => (
                          <tr key={attendance.MaDD} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{attendance.TenHS}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{attendance.Lop}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{attendance.TenTram || 'N/A'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {attendance.ThoiGian ? new Date(attendance.ThoiGian).toLocaleString('vi-VN') : 'N/A'}
                            </td>
                            <td className="px-4 py-3">
                              {attendance.TrangThai === '0' ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Chưa đón
                                </span>
                              ) : attendance.TrangThai === '1' ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Đã đón
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Đã trả
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Chưa có dữ liệu điểm danh</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end mt-6 pt-4 border-t">
              <button onClick={() => { 
                setShowDetailModal(false); 
                setActiveTab('stations');
                if (detailMapInstanceRef.current) {
                  detailMapInstanceRef.current.remove();
                  detailMapInstanceRef.current = null;
                }
              }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Tạo lịch trình mới</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tuyến đường <span className="text-red-500">*</span></label>
                  <select 
                    value={formData.MaTD} 
                    onChange={(e) => handleRouteChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" 
                    required>
                    <option value="">Chọn tuyến</option>
                    {routes.map(r => <option key={r.MaTD} value={r.MaTD}>{r.TenTuyenDuong}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tài xế <span className="text-red-500">*</span></label>
                  <select value={formData.MaTX} onChange={(e) => setFormData({ ...formData, MaTX: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" required>
                    <option value="">Chọn tài xế</option>
                    {drivers.filter(d => d.TrangThaiXoa === '0').map(d => <option key={d.MaTX} value={d.MaTX}>{d.TenTX}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Xe buýt <span className="text-red-500">*</span></label>
                  <select value={formData.MaXB} onChange={(e) => setFormData({ ...formData, MaXB: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" required>
                    <option value="">Chọn xe</option>
                    {buses.filter(b => b.TrangThaiXoa === '0').map(b => <option key={b.MaXB} value={b.MaXB}>{b.MaXB} - {b.BienSo}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giờ bắt đầu <span className="text-red-500">*</span></label>
                  <input type="time" value={formData.GioBatDau} onChange={(e) => setFormData({ ...formData, GioBatDau: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giờ kết thúc <span className="text-red-500">*</span></label>
                  <input type="time" value={formData.GioKetThuc} onChange={(e) => setFormData({ ...formData, GioKetThuc: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn ngày chạy <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-600 mb-2">Chọn khoảng ngày (nếu cùng ngày = 1 ngày)</p>
                
                {/* Chọn khoảng ngày */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <input type="date" id="fromDate" placeholder="Từ ngày"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                  <input type="date" id="toDate" placeholder="Đến ngày"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                  <button type="button" onClick={handleAddDateRange}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                    Thêm
                  </button>
                </div>

                {/* Danh sách ngày đã chọn */}
                {selectedDates.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-gray-700">Đã chọn {selectedDates.length} ngày</p>
                      <button 
                        type="button" 
                        onClick={() => setSelectedDates([])}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Xóa tất cả
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                      {selectedDates.map(date => (
                        <span 
                          key={date} 
                          className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          <Calendar size={14} />
                          {formatDateDisplay(date)}
                          <button 
                            type="button" 
                            onClick={() => handleRemoveDate(date)} 
                            className="text-red-500 hover:text-red-700 font-bold"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedDates.length === 0 && (
                  <p className="text-sm text-gray-500 text-center p-4 bg-gray-50 rounded-lg">
                    Chưa chọn ngày nào. Hãy chọn khoảng ngày hoặc từng ngày cụ thể.
                  </p>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Danh sách trạm của tuyến</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {availableStops.length > 0 
                    ? `Tuyến này có ${availableStops.length} trạm (đã được sắp xếp theo thứ tự). Tất cả trạm sẽ được thêm vào lịch trình.`
                    : 'Chọn tuyến đường để xem danh sách trạm'}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {availableStops.length > 0 ? (
                    availableStops.map(stop => (
                      <div key={stop.MaTram} className="p-4 border-2 border-blue-500 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 bg-blue-600 text-white">
                            {stop.ThuTu}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{stop.TenTram}</h5>
                            <p className="text-xs text-gray-600 mt-1">{stop.DiaChi}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-2 text-center text-gray-500 py-8">
                      {formData.MaTD ? 'Tuyến này chưa có trạm. Vui lòng thêm trạm trong trang "Tuyến đường".' : 'Vui lòng chọn tuyến đường'}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => { 
                  setShowModal(false);
                  setFormData({ MaTD: '', MaTX: '', MaXB: '', GioBatDau: '', GioKetThuc: '' });
                  setSelectedStops([]);
                  setAvailableStops([]);
                  setSelectedDates([]);
                }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Tạo lịch trình
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
