import { useState } from 'react';
import { mockDrivers, mockBuses, mockRoutes } from '../../data/mockData';
import { Calendar, Clock, Plus, Route, Edit, Trash2, Bus, MapPin, Eye, Navigation, CheckCircle, Search, X, GripVertical } from 'lucide-react';

export default function Schedule() {
  // Mock data dựa trên cấu trúc DB
  const [schedules, setSchedules] = useState([
    {
      MaLT: 'LT001',
      MaTD: 'RT-001',
      TenTuyenDuong: 'Tuyến 1 - Quận 1',
      MaTX: 1,
      TenTX: 'Trần Văn Tài',
      SDT: '0912345678',
      MaXB: 'BS-001',
      BienSo: '51A-12345',
      NgayChay: '2024-11-17',
      GioBatDau: '06:30',
      GioKetThuc: '07:30',
      TrangThai: 'active',
      TrangThaiXoa: '0',
      details: [
        { MaCTLT: 'CT001', MaTram: 'T001', TenTram: 'Trạm 1 - Trường ABC', DiaChi: '123 Nguyễn Văn Cừ, Q.5', KinhDo: '106.6818', ViDo: '10.7626', ThuTu: '1', TrangThaiQua: '1' },
        { MaCTLT: 'CT002', MaTram: 'T002', TenTram: 'Trạm 2 - Chợ Bến Thành', DiaChi: '45 Lê Lợi, Q.1', KinhDo: '106.6980', ViDo: '10.7720', ThuTu: '2', TrangThaiQua: '1' },
        { MaCTLT: 'CT003', MaTram: 'T003', TenTram: 'Trạm 3 - Công viên 23/9', DiaChi: '89 Võ Thị Sáu, Q.3', KinhDo: '106.6950', ViDo: '10.7820', ThuTu: '3', TrangThaiQua: '0' },
        { MaCTLT: 'CT004', MaTram: 'T004', TenTram: 'Trạm 4 - Trường XYZ', DiaChi: '200 Hoàng Hoa Thám, Q.Tân Bình', KinhDo: '106.6550', ViDo: '10.7870', ThuTu: '4', TrangThaiQua: '0' }
      ]
    },
    {
      MaLT: 'LT002',
      MaTD: 'RT-002',
      TenTuyenDuong: 'Tuyến 2 - Quận 2',
      MaTX: 2,
      TenTX: 'Nguyễn Văn Hùng',
      SDT: '0923456789',
      MaXB: 'BS-002',
      BienSo: '51B-67890',
      NgayChay: '2024-11-17',
      GioBatDau: '06:45',
      GioKetThuc: '07:45',
      TrangThai: 'active',
      TrangThaiXoa: '0',
      details: [
        { MaCTLT: 'CT005', MaTram: 'T005', TenTram: 'Trạm 5 - Bệnh viện Nhi Đồng', DiaChi: '67 Phan Đăng Lưu, Q.Phú Nhuận', KinhDo: '106.6780', ViDo: '10.7990', ThuTu: '1', TrangThaiQua: '0' },
        { MaCTLT: 'CT006', MaTram: 'T006', TenTram: 'Trạm 6 - Công viên Tao Đàn', DiaChi: '200 Trương Định, Q.3', KinhDo: '106.6900', ViDo: '10.7850', ThuTu: '2', TrangThaiQua: '0' },
      ]
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [searchDate, setSearchDate] = useState('');
  const [selectedScheduleIds, setSelectedScheduleIds] = useState([]);

  // Form data
  const [formData, setFormData] = useState({
    MaTD: '',
    MaTX: '',
    MaXB: '',
    NgayChay: '',
    GioBatDau: '',
    GioKetThuc: '',
    repeatMode: 'single', // 'single' hoặc 'multiple'
    repeatDates: [], // Danh sách ngày lặp lại
  });

  // Danh sách trạm đã chọn
  const [selectedStops, setSelectedStops] = useState([]);
  const [availableStops, setAvailableStops] = useState([]);

  // Lấy danh sách trạm khi chọn tuyến
  const handleRouteChange = (routeId) => {
    setFormData({ ...formData, MaTD: routeId });
    const route = mockRoutes.find(r => r.routeId === routeId);
    if (route && route.stops) {
      setAvailableStops(route.stops.map(stop => ({
        MaTram: stop.id.toString(),
        TenTram: stop.name,
        DiaChi: stop.address,
        KinhDo: '106.6818',
        ViDo: '10.7626',
      })));
    } else {
      setAvailableStops([]);
    }
    setSelectedStops([]);
  };

  // Thêm trạm vào danh sách
  const handleAddStop = (stop) => {
    if (!selectedStops.find(s => s.MaTram === stop.MaTram)) {
      setSelectedStops([...selectedStops, { ...stop, ThuTu: (selectedStops.length + 1).toString() }]);
    }
  };

  // Xóa trạm khỏi danh sách
  const handleRemoveStop = (stopId) => {
    const newStops = selectedStops.filter(s => s.MaTram !== stopId);
    // Cập nhật lại thứ tự
    const reorderedStops = newStops.map((stop, index) => ({
      ...stop,
      ThuTu: (index + 1).toString()
    }));
    setSelectedStops(reorderedStops);
  };

  // Di chuyển trạm lên
  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newStops = [...selectedStops];
    [newStops[index - 1], newStops[index]] = [newStops[index], newStops[index - 1]];
    // Cập nhật lại thứ tự
    const reorderedStops = newStops.map((stop, idx) => ({
      ...stop,
      ThuTu: (idx + 1).toString()
    }));
    setSelectedStops(reorderedStops);
  };

  // Di chuyển trạm xuống
  const handleMoveDown = (index) => {
    if (index === selectedStops.length - 1) return;
    const newStops = [...selectedStops];
    [newStops[index], newStops[index + 1]] = [newStops[index + 1], newStops[index]];
    // Cập nhật lại thứ tự
    const reorderedStops = newStops.map((stop, idx) => ({
      ...stop,
      ThuTu: (idx + 1).toString()
    }));
    setSelectedStops(reorderedStops);
  };

  // Thêm/xóa ngày lặp lại
  const handleAddRepeatDate = (date) => {
    if (date && !formData.repeatDates.includes(date)) {
      setFormData({
        ...formData,
        repeatDates: [...formData.repeatDates, date].sort()
      });
    }
  };

  const handleRemoveRepeatDate = (date) => {
    setFormData({
      ...formData,
      repeatDates: formData.repeatDates.filter(d => d !== date)
    });
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedStops.length === 0) {
      alert('Vui lòng chọn ít nhất 1 trạm!');
      return;
    }

    const route = mockRoutes.find(r => r.routeId === formData.MaTD);
    const driver = mockDrivers.find(d => d.id === parseInt(formData.MaTX));
    const bus = mockBuses.find(b => b.busId === formData.MaXB);

    // Tạo danh sách ngày cần tạo lịch trình
    const datesToCreate = formData.repeatMode === 'single' 
      ? [formData.NgayChay]
      : formData.repeatDates;

    if (datesToCreate.length === 0) {
      alert('Vui lòng chọn ít nhất 1 ngày!');
      return;
    }

    if (editingSchedule) {
      // Cập nhật lịch trình
      setSchedules(schedules.map(s =>
        s.MaLT === editingSchedule.MaLT
          ? {
              ...s,
              ...formData,
              TenTuyenDuong: route?.name || '',
              TenTX: driver?.name || '',
              SDT: driver?.phone || '',
              BienSo: bus?.licensePlate || '',
              details: selectedStops.map((stop, index) => ({
                MaCTLT: `CT${Date.now()}${index}`,
                ...stop,
                TrangThaiQua: '0',
                TrangThaiXoa: '0'
              }))
            }
          : s
      ));
    } else {
      // Tạo mới lịch trình cho từng ngày
      const newSchedules = datesToCreate.map((date, dateIndex) => ({
        MaLT: `LT${Date.now()}${dateIndex}`,
        MaTD: formData.MaTD,
        MaTX: parseInt(formData.MaTX),
        MaXB: formData.MaXB,
        NgayChay: date,
        GioBatDau: formData.GioBatDau,
        GioKetThuc: formData.GioKetThuc,
        TrangThai: 'active',
        TrangThaiXoa: '0',
        TenTuyenDuong: route?.name || '',
        TenTX: driver?.name || '',
        SDT: driver?.phone || '',
        BienSo: bus?.licensePlate || '',
        details: selectedStops.map((stop, index) => ({
          MaCTLT: `CT${Date.now()}${dateIndex}${index}`,
          ...stop,
          TrangThaiQua: '0',
          TrangThaiXoa: '0'
        }))
      }));
      
      setSchedules([...schedules, ...newSchedules]);
    }

    setShowModal(false);
    setEditingSchedule(null);
    resetFormData();
  };

  const resetFormData = () => {
    setFormData({
      MaTD: '',
      MaTX: '',
      MaXB: '',
      NgayChay: '',
      GioBatDau: '',
      GioKetThuc: '',
      repeatMode: 'single',
      repeatDates: [],
    });
    setSelectedStops([]);
    setAvailableStops([]);
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      MaTD: schedule.MaTD,
      MaTX: schedule.MaTX.toString(),
      MaXB: schedule.MaXB,
      NgayChay: schedule.NgayChay,
      GioBatDau: schedule.GioBatDau,
      GioKetThuc: schedule.GioKetThuc,
      repeatMode: 'single',
      repeatDates: [],
    });
    
    // Load trạm của tuyến
    const route = mockRoutes.find(r => r.routeId === schedule.MaTD);
    if (route && route.stops) {
      setAvailableStops(route.stops.map(stop => ({
        MaTram: stop.id.toString(),
        TenTram: stop.name,
        DiaChi: stop.address,
        KinhDo: '106.6818',
        ViDo: '10.7626',
      })));
    }
    
    // Load trạm đã chọn
    setSelectedStops(schedule.details || []);
    setShowModal(true);
  };

  const handleDelete = (MaLT) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch trình này?')) {
      setSchedules(schedules.map(s => 
        s.MaLT === MaLT ? { ...s, TrangThaiXoa: '1' } : s
      ));
    }
  };

  const handleViewDetail = (schedule) => {
    setSelectedSchedule(schedule);
    setShowDetailModal(true);
  };

  // Xử lý checkbox
  const handleSelectSchedule = (MaLT) => {
    setSelectedScheduleIds(prev => 
      prev.includes(MaLT) 
        ? prev.filter(id => id !== MaLT)
        : [...prev, MaLT]
    );
  };

  const handleSelectAll = () => {
    if (selectedScheduleIds.length === filteredSchedules.length) {
      setSelectedScheduleIds([]);
    } else {
      setSelectedScheduleIds(filteredSchedules.map(s => s.MaLT));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedScheduleIds.length === 0) {
      alert('Vui lòng chọn ít nhất 1 lịch trình để xóa!');
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedScheduleIds.length} lịch trình đã chọn?`)) {
      setSchedules(schedules.map(s => 
        selectedScheduleIds.includes(s.MaLT) ? { ...s, TrangThaiXoa: '1' } : s
      ));
      setSelectedScheduleIds([]);
    }
  };



  const getAvailableDrivers = (excludeScheduleId = null) => {
    const assignedDriverIds = schedules
      .filter(s => s.NgayChay === formData.NgayChay && s.MaLT !== excludeScheduleId && s.TrangThaiXoa === '0')
      .map(s => s.MaTX);
    return mockDrivers.filter(d => d.status === 'active' && !assignedDriverIds.includes(d.id));
  };

  const getAvailableBuses = (excludeScheduleId = null) => {
    const assignedBusIds = schedules
      .filter(s => s.NgayChay === formData.NgayChay && s.MaLT !== excludeScheduleId && s.TrangThaiXoa === '0')
      .map(s => s.MaXB);
    return mockBuses.filter(b => b.status === 'active' && !assignedBusIds.includes(b.busId));
  };

  // Lọc lịch trình theo ngày tìm kiếm
  const filteredSchedules = schedules.filter(s => {
    if (s.TrangThaiXoa === '1') return false;
    if (!searchDate) return true;
    return s.NgayChay === searchDate;
  });

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
            <button
              onClick={handleDeleteSelected}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Trash2 size={20} />
              Xóa đã chọn ({selectedScheduleIds.length})
            </button>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Tạo lịch trình
          </button>
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tìm kiếm theo ngày..."
            />
            {searchDate && (
              <button
                onClick={() => setSearchDate('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedScheduleIds.length === filteredSchedules.length && filteredSchedules.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã LT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày chạy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tuyến đường</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSchedules.map((schedule) => {
                const completedStops = schedule.details?.filter(d => d.TrangThaiQua === '1').length || 0;
                const totalStops = schedule.details?.length || 0;
                const isCompleted = completedStops === totalStops && totalStops > 0;
                const isInProgress = completedStops > 0 && completedStops < totalStops;
                
                return (
                  <tr key={schedule.MaLT} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedScheduleIds.includes(schedule.MaLT)}
                        onChange={() => handleSelectSchedule(schedule.MaLT)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{schedule.MaLT}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="text-blue-500" size={16} />
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(schedule.NgayChay).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Route className="text-green-500" size={16} />
                        <div className="text-sm font-medium text-gray-900">{schedule.TenTuyenDuong}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <Clock size={14} className="text-gray-400" />
                        {schedule.GioBatDau} - {schedule.GioKetThuc}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isCompleted ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle size={14} className="mr-1" />
                          Hoàn thành
                        </span>
                      ) : isInProgress ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Navigation size={14} className="mr-1" />
                          Đang chạy ({completedStops}/{totalStops})
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <Clock size={14} className="mr-1" />
                          Chưa bắt đầu
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleViewDetail(schedule)} 
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <Eye size={14} /> Xem chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Chi tiết lịch trình */}
      {showDetailModal && selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Chi tiết lịch trình {selectedSchedule.MaLT}</h2>
                <p className="text-gray-600 mt-1">
                  {selectedSchedule.TenTuyenDuong} - {new Date(selectedSchedule.NgayChay).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Thông tin chung */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Tài xế</p>
                <p className="font-medium text-gray-900">{selectedSchedule.TenTX} - {selectedSchedule.SDT}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Xe buýt</p>
                <p className="font-medium text-gray-900">{selectedSchedule.MaXB} ({selectedSchedule.BienSo})</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Giờ bắt đầu</p>
                <p className="font-medium text-gray-900">{selectedSchedule.GioBatDau}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Giờ kết thúc</p>
                <p className="font-medium text-gray-900">{selectedSchedule.GioKetThuc}</p>
              </div>
            </div>

            {/* Danh sách trạm */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Danh sách trạm ({selectedSchedule.details?.length || 0})</h3>
              <div className="space-y-4">
                {selectedSchedule.details?.map((detail, index) => (
                  <div key={detail.MaCTLT} className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50">
                    {/* Timeline */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        detail.TrangThaiQua === '1' ? 'bg-green-500' : 'bg-gray-400'
                      }`}>
                        {detail.ThuTu}
                      </div>
                      {index < (selectedSchedule.details?.length || 0) - 1 && (
                        <div className={`w-1 h-16 ${
                          detail.TrangThaiQua === '1' ? 'bg-green-300' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>

                    {/* Thông tin trạm */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{detail.TenTram}</h4>
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <MapPin size={14} />
                            {detail.DiaChi}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Tọa độ: {detail.ViDo}, {detail.KinhDo}
                          </p>
                        </div>
                        <span className={`inline-block text-xs px-2 py-1 rounded ${
                          detail.TrangThaiQua === '1' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {detail.TrangThaiQua === '1' ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle size={12} /> Đã qua
                            </span>
                          ) : (
                            'Chưa qua'
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bản đồ */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Bản đồ tuyến đường</h3>
              <div className="bg-gray-100 rounded-lg h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Bản đồ hiển thị {selectedSchedule.details?.length || 0} trạm</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Tích hợp Leaflet để hiển thị bản đồ tương tác
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEdit(selectedSchedule);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Edit size={16} /> Sửa lịch trình
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Bạn có chắc chắn muốn xóa lịch trình này?')) {
                      handleDelete(selectedSchedule.MaLT);
                      setShowDetailModal(false);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <Trash2 size={16} /> Xóa lịch trình
                </button>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Modal Thêm/Sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-6xl my-8 max-h-[95vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingSchedule ? 'Sửa lịch trình' : 'Tạo lịch trình mới'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tuyến đường <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.MaTD}
                    onChange={(e) => handleRouteChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Chọn tuyến đường</option>
                    {mockRoutes.map(route => (
                      <option key={route.id} value={route.routeId}>{route.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tài xế <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.MaTX}
                    onChange={(e) => setFormData({ ...formData, MaTX: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Chọn tài xế</option>
                    {getAvailableDrivers(editingSchedule?.MaLT).map(driver => (
                      <option key={driver.id} value={driver.id}>{driver.name} - {driver.phone}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xe buýt <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.MaXB}
                    onChange={(e) => setFormData({ ...formData, MaXB: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Chọn xe buýt</option>
                    {getAvailableBuses(editingSchedule?.MaLT).map(bus => (
                      <option key={bus.id} value={bus.busId}>{bus.busId} - {bus.licensePlate}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giờ bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.GioBatDau}
                    onChange={(e) => setFormData({ ...formData, GioBatDau: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giờ kết thúc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.GioKetThuc}
                    onChange={(e) => setFormData({ ...formData, GioKetThuc: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Chế độ lặp lại */}
              <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Chế độ lặp lại <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="single"
                        checked={formData.repeatMode === 'single'}
                        onChange={(e) => setFormData({ ...formData, repeatMode: e.target.value, repeatDates: [] })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Một ngày</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="multiple"
                        checked={formData.repeatMode === 'multiple'}
                        onChange={(e) => setFormData({ ...formData, repeatMode: e.target.value, NgayChay: '' })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Nhiều ngày</span>
                    </label>
                  </div>

                  {formData.repeatMode === 'single' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày chạy <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.NgayChay}
                        onChange={(e) => setFormData({ ...formData, NgayChay: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Chọn các ngày chạy <span className="text-red-500">*</span>
                      </label>
                      
                      {/* Chọn khoảng ngày */}
                      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Chọn khoảng ngày</h4>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="date"
                            id="startDateInput"
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            placeholder="Từ ngày"
                          />
                          <input
                            type="date"
                            id="endDateInput"
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            placeholder="Đến ngày"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const startInput = document.getElementById('startDateInput');
                              const endInput = document.getElementById('endDateInput');
                              if (startInput.value && endInput.value) {
                                const start = new Date(startInput.value);
                                const end = new Date(endInput.value);
                                
                                if (start > end) {
                                  alert('Ngày bắt đầu phải nhỏ hơn ngày kết thúc!');
                                  return;
                                }
                                
                                // Tạo danh sách các ngày trong khoảng
                                const dates = [];
                                const current = new Date(start);
                                while (current <= end) {
                                  const dateStr = current.toISOString().split('T')[0];
                                  if (!formData.repeatDates.includes(dateStr)) {
                                    dates.push(dateStr);
                                  }
                                  current.setDate(current.getDate() + 1);
                                }
                                
                                setFormData({
                                  ...formData,
                                  repeatDates: [...formData.repeatDates, ...dates].sort()
                                });
                                
                                startInput.value = '';
                                endInput.value = '';
                              } else {
                                alert('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc!');
                              }
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                          >
                            <Plus size={16} /> Thêm khoảng
                          </button>
                        </div>
                      </div>

                      {/* Chọn từng ngày */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Hoặc chọn từng ngày</h4>
                        <div className="flex gap-2">
                          <input
                            type="date"
                            id="repeatDateInput"
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById('repeatDateInput');
                              if (input.value) {
                                handleAddRepeatDate(input.value);
                                input.value = '';
                              }
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                      </div>

                      {/* Danh sách ngày đã chọn */}
                      {formData.repeatDates.length > 0 && (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium text-gray-700">
                              Đã chọn {formData.repeatDates.length} ngày
                            </h4>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, repeatDates: [] })}
                              className="text-xs text-red-600 hover:text-red-800"
                            >
                              Xóa tất cả
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                            {formData.repeatDates.map(date => (
                              <div key={date} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                <Calendar size={14} />
                                {new Date(date).toLocaleDateString('vi-VN')}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveRepeatDate(date)}
                                  className="hover:text-blue-900"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {formData.repeatDates.length === 0 && (
                        <p className="text-sm text-gray-500 mt-2 text-center p-4 bg-gray-50 rounded-lg">
                          Chưa chọn ngày nào. Hãy chọn khoảng ngày hoặc từng ngày cụ thể.
                        </p>
                      )}
                    </div>
                  )}
                </div>

              {/* Chọn trạm */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Chọn trạm dừng <span className="text-red-500">*</span>
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  {/* Danh sách trạm có sẵn */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Trạm có sẵn</h4>
                    <div className="border rounded-lg p-3 bg-gray-50 max-h-80 overflow-y-auto">
                      {availableStops.length > 0 ? (
                        <div className="space-y-2">
                          {availableStops.map(stop => (
                            <div
                              key={stop.MaTram}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                selectedStops.find(s => s.MaTram === stop.MaTram)
                                  ? 'bg-gray-200 border-gray-400 cursor-not-allowed'
                                  : 'bg-white hover:bg-blue-50 border-gray-300'
                              }`}
                              onClick={() => !selectedStops.find(s => s.MaTram === stop.MaTram) && handleAddStop(stop)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900 text-sm">{stop.TenTram}</h5>
                                  <p className="text-xs text-gray-600 mt-1">{stop.DiaChi}</p>
                                </div>
                                {!selectedStops.find(s => s.MaTram === stop.MaTram) && (
                                  <Plus size={20} className="text-blue-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-8">
                          {formData.MaTD ? 'Tuyến này chưa có trạm' : 'Vui lòng chọn tuyến đường'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Danh sách trạm đã chọn */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Trạm đã chọn ({selectedStops.length})
                    </h4>
                    <div className="border rounded-lg p-3 bg-blue-50 max-h-80 overflow-y-auto">
                      {selectedStops.length > 0 ? (
                        <div className="space-y-2">
                          {selectedStops.map((stop, index) => (
                            <div
                              key={stop.MaTram}
                              className="p-3 bg-white border border-blue-200 rounded-lg"
                            >
                              <div className="flex items-start gap-3">
                                {/* Thứ tự */}
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                                  {stop.ThuTu}
                                </div>

                                {/* Thông tin trạm */}
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-medium text-gray-900 text-sm">{stop.TenTram}</h5>
                                  <p className="text-xs text-gray-600 mt-1 truncate">{stop.DiaChi}</p>
                                </div>

                                {/* Nút điều khiển */}
                                <div className="flex flex-col gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleMoveUp(index)}
                                    disabled={index === 0}
                                    className={`p-1 rounded ${
                                      index === 0
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-blue-600 hover:bg-blue-100'
                                    }`}
                                    title="Di chuyển lên"
                                  >
                                    ▲
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveDown(index)}
                                    disabled={index === selectedStops.length - 1}
                                    className={`p-1 rounded ${
                                      index === selectedStops.length - 1
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'text-blue-600 hover:bg-blue-100'
                                    }`}
                                    title="Di chuyển xuống"
                                  >
                                    ▼
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveStop(stop.MaTram)}
                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                    title="Xóa"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-8">
                          Chưa chọn trạm nào
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Nút submit */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingSchedule(null);
                    resetFormData();
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingSchedule ? 'Cập nhật' : 'Tạo lịch trình'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
