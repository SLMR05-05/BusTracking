import React, { useState, useEffect } from 'react';
import { Plus, Search, X } from 'lucide-react';
import axios from "axios";

export default function BusesManagement() {
  const [buses, setBuses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [formData, setFormData] = useState({
    id: '',
    licensePlate: '',
    capacity: '',
    status: '0', // mặc định: 0 = ready
  });

  const API_URL = 'http://localhost:5000/api/buses';

  const fetchBuses = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      const formattedBuses = res.data.map(bus => ({
        id: bus.MaXB,
        licensePlate: bus.BienSo,
        capacity: bus.SucChua,
        status: String(bus.TrangThai)   // convert sang string cho select
      }));

      setBuses(formattedBuses);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách xe buýt:', error);
    }
  };

  useEffect(() => {
    fetchBuses();   // ✔ đúng hàm
  }, []);

  const filteredBuses = buses.filter(b => {
    const search = searchText.trim().toLowerCase();
    return (
      b.licensePlate.toLowerCase().includes(search) ||
      String(b.capacity).includes(search)  // ✔ capacity là số
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editingBus) {
        await axios.put(`${API_URL}/${editingBus.id}`, {
          BienSo: formData.licensePlate,
          SucChua: formData.capacity,
          TrangThai: formData.status,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(API_URL, {
          BienSo: formData.licensePlate,
          SucChua: formData.capacity,
          TrangThai: formData.status,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      fetchBuses();
      setShowModal(false);
      setEditingBus(null);
      resetFormData();

    } catch (error) {
      console.error("Lỗi khi lưu xe buýt:", error);
    }
  };

  const resetFormData = () => {
    setFormData({
      id: '',
      licensePlate: '',
      capacity: '',
      status: '0',
    });
  };

  const handleEdit = (bus) => {
    setEditingBus(bus);
    setFormData({
      id: bus.id,
      licensePlate: bus.licensePlate,
      capacity: bus.capacity,
      status: bus.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa xe buýt này?')) {
      try {
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        fetchBuses();
      } catch (error) {
        console.error('Lỗi khi xóa xe buýt:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '0': return 'bg-yellow-100 text-yellow-800'; // ready
      case '1': return 'bg-green-100 text-green-800'; // active
      case '2': return 'bg-red-100 text-red-800'; // maintenance
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case '0': return 'Sẵn sàng';
      case '1': return 'Đang hoạt động';
      case '2': return 'Bảo trì';
      default: return 'Không xác định';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý xe buýt</h1>
          <p className="text-gray-600 mt-1">Danh sách và thông tin xe buýt trong hệ thống</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Thêm xe buýt
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />

            <input
              type="text"
              placeholder="Tìm theo biển số hoặc sức chứa..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {searchText && (
              <button
                onClick={() => setSearchText("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2
                          text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Xe buýt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Biển số</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sức chứa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBuses.map((bus) => (
                <tr key={bus.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{bus.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{bus.licensePlate}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{bus.capacity} chỗ</td>

                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bus.status)}`}>
                      {getStatusText(bus.status)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(bus)} className="text-blue-600 hover:text-blue-900">Sửa</button>
                      <button onClick={() => handleDelete(bus.id)} className="text-red-600 hover:text-red-900">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">
              {editingBus ? 'Sửa thông tin xe buýt' : 'Thêm xe buýt mới'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Biển số xe</label>
                  <input
                    type="text"
                    value={formData.licensePlate}
                    onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Sức chứa</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="0">Sẵn sàng</option>
                  <option value="1">Đang hoạt động</option>
                  <option value="2">Bảo trì</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingBus(null); }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {editingBus ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
