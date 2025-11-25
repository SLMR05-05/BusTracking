import { useState, useEffect } from 'react';
import { Users, MapPin, Plus, Edit, Trash2, ArrowUp, ArrowDown, Settings } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function Routes() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showStationsModal, setShowStationsModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [stations, setStations] = useState([]);
  
  const [formData, setFormData] = useState({
    MaTD: '',
    TenTuyenDuong: '',
    BatDau: '',
    KetThuc: ''
  });

  // Fetch routes on mount
  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/routes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRoutes(data);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      alert('Lỗi khi tải dữ liệu tuyến đường!');
    } finally {
      setLoading(false);
    }
  };

  const fetchStations = async (routeId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/routes/${routeId}/stops`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Sort stations by ThuTu (order)
        const sortedData = data.sort((a, b) => (a.ThuTu || 0) - (b.ThuTu || 0));
        console.log('📍 [Routes] Stations for route', routeId, ':', sortedData);
        setStations(sortedData);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
      alert('Lỗi khi tải danh sách trạm!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      if (editingRoute) {
        // Update route
        const response = await fetch(`${API_URL}/routes/${editingRoute.MaTD}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          alert('Cập nhật tuyến đường thành công!');
        } else {
          throw new Error('Failed to update route');
        }
      } else {
        // Create new route
        const response = await fetch(`${API_URL}/routes`, {
          method: 'POST',
          headers,
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          alert('Tạo tuyến đường thành công!');
        } else {
          throw new Error('Failed to create route');
        }
      }

      setShowModal(false);
      setEditingRoute(null);
      setFormData({ MaTD: '', TenTuyenDuong: '', BatDau: '', KetThuc: '' });
      fetchRoutes();
    } catch (error) {
      console.error('Error saving route:', error);
      alert('Lỗi khi lưu tuyến đường!');
    }
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData({
      MaTD: route.MaTD,
      TenTuyenDuong: route.TenTuyenDuong,
      BatDau: route.BatDau,
      KetThuc: route.KetThuc
    });
    setShowModal(true);
  };

  const handleDelete = async (routeId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tuyến đường này?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/routes/${routeId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Xóa tuyến đường thành công!');
        fetchRoutes();
      } else {
        throw new Error('Failed to delete route');
      }
    } catch (error) {
      console.error('Error deleting route:', error);
      alert('Lỗi khi xóa tuyến đường!');
    }
  };

  const handleViewStations = async (route) => {
    setSelectedRoute(route);
    await fetchStations(route.MaTD);
    setShowStationsModal(true);
  };

  const handleMoveStation = async (stationId, direction) => {
    const currentIndex = stations.findIndex(s => s.MaTram === stationId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= stations.length) return;

    // Swap ThuTu values
    const newStations = [...stations];
    const temp = newStations[currentIndex].ThuTu;
    newStations[currentIndex].ThuTu = newStations[newIndex].ThuTu;
    newStations[newIndex].ThuTu = temp;

    // Update in database
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      await Promise.all([
        fetch(`${API_URL}/routes/${selectedRoute.MaTD}/stops/${newStations[currentIndex].MaTram}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ ThuTu: newStations[currentIndex].ThuTu })
        }),
        fetch(`${API_URL}/routes/${selectedRoute.MaTD}/stops/${newStations[newIndex].MaTram}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ ThuTu: newStations[newIndex].ThuTu })
        })
      ]);

      // Re-sort and update state
      newStations.sort((a, b) => a.ThuTu - b.ThuTu);
      setStations(newStations);
    } catch (error) {
      console.error('Error updating station order:', error);
      alert('Lỗi khi cập nhật thứ tự trạm!');
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý tuyến đường</h1>
          <p className="text-gray-600 mt-1">Danh sách các tuyến đường và trạm dừng</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Thêm tuyến đường
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã tuyến</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên tuyến đường</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Điểm bắt đầu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Điểm kết thúc</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {routes.filter(r => r.TrangThaiXoa === '0').map((route) => (
              <tr key={route.MaTD} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{route.MaTD}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{route.TenTuyenDuong}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{route.BatDau}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{route.KetThuc}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleViewStations(route)}
                      className="text-purple-600 hover:text-purple-900 px-3 py-1 rounded hover:bg-purple-50 flex items-center gap-1"
                      title="Quản lý trạm"
                    >
                      <Settings size={16} />
                      Quản lý trạm
                    </button>
                    <button
                      onClick={() => handleEdit(route)}
                      className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded hover:bg-blue-50"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(route.MaTD)}
                      className="text-red-600 hover:text-red-900 px-3 py-1 rounded hover:bg-red-50"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal thêm/sửa tuyến đường */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingRoute ? 'Sửa tuyến đường' : 'Thêm tuyến đường mới'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingRoute && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã tuyến đường <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.MaTD}
                    onChange={(e) => setFormData({ ...formData, MaTD: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: TD001"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên tuyến đường <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.TenTuyenDuong}
                  onChange={(e) => setFormData({ ...formData, TenTuyenDuong: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Tuyến 1 - Quận 1 đến Quận 5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điểm bắt đầu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.BatDau}
                  onChange={(e) => setFormData({ ...formData, BatDau: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Trường ABC"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điểm kết thúc <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.KetThuc}
                  onChange={(e) => setFormData({ ...formData, KetThuc: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: Khu đô thị XYZ"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingRoute(null);
                    setFormData({ MaTD: '', TenTuyenDuong: '', BatDau: '', KetThuc: '' });
                  }}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingRoute ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal quản lý trạm */}
      {showStationsModal && selectedRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Quản lý trạm - {selectedRoute.TenTuyenDuong}
                </h2>
                <p className="text-gray-600">
                  {stations.length} trạm trên tuyến này
                </p>
              </div>
              <button
                onClick={() => {
                  setShowStationsModal(false);
                  setSelectedRoute(null);
                  setStations([]);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Sử dụng nút mũi tên để sắp xếp thứ tự trạm. Thứ tự này sẽ được áp dụng cho tất cả lịch trình sử dụng tuyến đường này.
              </p>
            </div>

            {stations.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="mx-auto mb-4 text-gray-400" size={64} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có trạm nào
                </h3>
                <p className="text-gray-600">
                  Thêm trạm trong phần "Quản lý trạm dừng"
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {stations.map((station, index) => (
                  <div key={station.MaTram} className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                      {station.ThuTu}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{station.TenTram}</h4>
                      <p className="text-sm text-gray-600">{station.DiaChi}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleMoveStation(station.MaTram, 'up')}
                        disabled={index === 0}
                        className={`p-1 rounded ${
                          index === 0
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-blue-600 hover:bg-blue-50'
                        }`}
                        title="Di chuyển lên"
                      >
                        <ArrowUp size={20} />
                      </button>
                      <button
                        onClick={() => handleMoveStation(station.MaTram, 'down')}
                        disabled={index === stations.length - 1}
                        className={`p-1 rounded ${
                          index === stations.length - 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-blue-600 hover:bg-blue-50'
                        }`}
                        title="Di chuyển xuống"
                      >
                        <ArrowDown size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
