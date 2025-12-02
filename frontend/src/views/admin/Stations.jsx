import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Plus, MapPin, Edit, Trash2 } from "lucide-react";

const API_URL = 'http://localhost:5000/api';

export default function Station() {
  const [stations, setStations] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRoute, setFilterRoute] = useState('');
  
  const [formData, setFormData] = useState({
    MaTram: "",
    TenTram: "",
    DiaChi: "",
    KinhDo: "",
    ViDo: "",
    MaTD: "",
    ThuTu: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [stationsRes, routesRes] = await Promise.all([
        fetch(`${API_URL}/stops`, { headers }),
        fetch(`${API_URL}/routes`, { headers })
      ]);

      let stationsData = [];
      let routesData = [];

      if (stationsRes.ok) {
        stationsData = await stationsRes.json();
      }

      if (routesRes.ok) {
        routesData = await routesRes.json();
        setRoutes(routesData);
      }

      // Map route names to stations
      const stationsWithRoutes = stationsData.map(station => {
        const route = routesData.find(r => r.MaTD === station.MaTD);
        return {
          ...station,
          TenTuyenDuong: route ? route.TenTuyenDuong : null
        };
      });

      // Sort by ThuTu (order)
      stationsWithRoutes.sort((a, b) => (a.ThuTu || 0) - (b.ThuTu || 0));

      setStations(stationsWithRoutes);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Lỗi khi tải dữ liệu!');
    } finally {
      setLoading(false);
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

      const dataToSend = {
        TenTram: formData.TenTram,
        DiaChi: formData.DiaChi,
        KinhDo: formData.KinhDo,
        ViDo: formData.ViDo,
        MaTD: formData.MaTD,
        ThuTu: parseInt(formData.ThuTu) || 1
      };

      if (editingStation) {
        // Update
        const response = await fetch(`${API_URL}/stops/${editingStation.MaTram}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(dataToSend)
        });

        if (response.ok) {
          alert('Cập nhật trạm thành công!');
          fetchData();
        } else {
          const error = await response.text();
          alert('Lỗi: ' + error);
        }
      } else {
        // Create - backend sẽ tự sinh mã
        const response = await fetch(`${API_URL}/stops`, {
          method: 'POST',
          headers,
          body: JSON.stringify(dataToSend)
        });

        if (response.ok) {
          const result = await response.json();
          alert(`Thêm trạm thành công! Mã trạm: ${result.MaTram || 'N/A'}`);
          fetchData();
        } else {
          const error = await response.text();
          alert('Lỗi: ' + error);
        }
      }

      setShowModal(false);
      setEditingStation(null);
      setFormData({
        MaTram: "",
        TenTram: "",
        DiaChi: "",
        KinhDo: "",
        ViDo: "",
        MaTD: "",
        ThuTu: ""
      });
    } catch (error) {
      console.error('Error saving station:', error);
      alert('Lỗi khi lưu trạm!');
    }
  };

  const handleEdit = (station) => {
    setEditingStation(station);
    setFormData({
      MaTram: station.MaTram,
      TenTram: station.TenTram,
      DiaChi: station.DiaChi,
      KinhDo: station.KinhDo,
      ViDo: station.ViDo,
      MaTD: station.MaTD,
      ThuTu: station.ThuTu
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa trạm này?")) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/stops/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Xóa trạm thành công!');
        fetchData();
      } else {
        const errorData = await response.json();
        alert('Lỗi khi xóa trạm: ' + (errorData.error || 'Không xác định'));
      }
    } catch (error) {
      console.error('Error deleting station:', error);
      alert('Lỗi khi xóa trạm: ' + error.message);
    }
  };

  const filteredStations = stations.filter(station => {
    const matchSearch = !searchTerm || 
      station.MaTram?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.TenTram?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.DiaChi?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchRoute = !filterRoute || station.MaTD === filterRoute;
    
    return matchSearch && matchRoute;
  });

  const handleMapClick = async (lat, lng) => {
    setFormData((prev) => ({ 
      ...prev, 
      ViDo: lat.toFixed(6), 
      KinhDo: lng.toFixed(6) 
    }));

    // Gọi Nominatim API để lấy địa chỉ từ toạ độ
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      if (data.display_name) {
        setFormData((prev) => ({ ...prev, DiaChi: data.display_name }));
      } else {
        setFormData((prev) => ({ ...prev, DiaChi: "Không tìm thấy địa chỉ" }));
      }
    } catch (err) {
      setFormData((prev) => ({ ...prev, DiaChi: "Lỗi khi lấy địa chỉ" }));
    }
  };

  // Component con để xử lý click trên bản đồ
  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        handleMapClick(e.latlng.lat, e.latlng.lng);
      },
    });
    return formData.ViDo && formData.KinhDo ? (
      <Marker position={[parseFloat(formData.ViDo), parseFloat(formData.KinhDo)]} />
    ) : null;
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Trạm</h1>
          <p className="text-gray-600 mt-1">Danh sách các trạm trong hệ thống ({filteredStations.length} trạm)</p>
        </div>
        <button
          onClick={() => {
            setEditingStation(null);
            setFormData({
              MaTram: "",
              TenTram: "",
              DiaChi: "",
              KinhDo: "",
              ViDo: "",
              MaTD: "",
              ThuTu: ""
            });
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Thêm trạm
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm trạm (mã, tên, địa chỉ)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={filterRoute}
            onChange={(e) => setFilterRoute(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tất cả tuyến đường</option>
            {routes.map((route) => (
              <option key={route.MaTD} value={route.MaTD}>
                {route.TenTuyenDuong}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã trạm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên trạm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tuyến đường</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thứ tự</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tọa độ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm || filterRoute ? 'Không tìm thấy trạm phù hợp' : 'Chưa có trạm nào. Hãy thêm trạm mới!'}
                  </td>
                </tr>
              ) : (
                filteredStations.map((station) => (
                  <tr key={station.MaTram} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{station.MaTram}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-blue-500" />
                        {station.TenTram}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {station.TenTuyenDuong || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 font-bold">
                        {station.ThuTu}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {station.DiaChi}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {parseFloat(station.ViDo).toFixed(4)}, {parseFloat(station.KinhDo).toFixed(4)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(station)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                        >
                          <Edit size={14} />
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(station.MaTram)}
                          className="text-red-600 hover:text-red-900 flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal thêm/sửa trạm */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingStation ? "Sửa trạm" : "Thêm trạm mới"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tuyến đường <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.MaTD}
                  onChange={async (e) => {
                    const selectedRoute = e.target.value;
                    setFormData({ ...formData, MaTD: selectedRoute });
                    
                    // Tự động lấy số thứ tự tiếp theo khi chọn tuyến
                    if (selectedRoute && !editingStation) {
                      try {
                        const token = localStorage.getItem('token');
                        const response = await fetch(`${API_URL}/routes/${selectedRoute}/stops`, {
                          headers: { 'Authorization': `Bearer ${token}` }
                        });
                        
                        if (response.ok) {
                          const stops = await response.json();
                          const maxThuTu = stops.length > 0 
                            ? Math.max(...stops.map(s => s.ThuTu || 0))
                            : 0;
                          const nextThuTu = maxThuTu + 1;
                          
                          setFormData(prev => ({ ...prev, ThuTu: nextThuTu.toString() }));
                        }
                      } catch (error) {
                        console.error('Error fetching stops:', error);
                        setFormData(prev => ({ ...prev, ThuTu: '1' }));
                      }
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Chọn tuyến đường --</option>
                  {routes.map((route) => (
                    <option key={route.MaTD} value={route.MaTD}>
                      {route.TenTuyenDuong}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Trạm này sẽ thuộc về tuyến đường được chọn. Số thứ tự sẽ tự động được gán.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thứ tự trạm <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.ThuTu}
                  onChange={(e) =>
                    setFormData({ ...formData, ThuTu: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  placeholder="Tự động gán khi chọn tuyến"
                  required
                  readOnly={!editingStation}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {editingStation 
                    ? 'Có thể chỉnh sửa thứ tự trạm' 
                    : 'Số thứ tự sẽ tự động được gán khi chọn tuyến đường'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên trạm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.TenTram}
                  onChange={(e) =>
                    setFormData({ ...formData, TenTram: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên trạm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={formData.DiaChi}
                  onChange={(e) =>
                    setFormData({ ...formData, DiaChi: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Chọn vị trí trên bản đồ để tự động điền hoặc nhập thủ công"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vĩ độ (Latitude) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ViDo}
                    onChange={(e) =>
                      setFormData({ ...formData, ViDo: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="10.762622"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kinh độ (Longitude) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.KinhDo}
                    onChange={(e) =>
                      setFormData({ ...formData, KinhDo: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="106.682223"
                    required
                  />
                </div>
              </div>

              {/* Bản đồ chọn vị trí */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn vị trí trên bản đồ
                </label>
                <div className="h-64 w-full rounded-lg overflow-hidden border">
                  <MapContainer
                    center={[
                      formData.ViDo ? parseFloat(formData.ViDo) : 10.7769,
                      formData.KinhDo ? parseFloat(formData.KinhDo) : 106.7009
                    ]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='© OpenStreetMap contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationPicker />
                  </MapContainer>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Click vào bản đồ để chọn vị trí trạm
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingStation(null);
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingStation ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
