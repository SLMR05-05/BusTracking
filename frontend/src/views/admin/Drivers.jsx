import { useState, useEffect } from 'react';
import { Plus, Phone, Edit, Trash2 } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    MaTX: '',
    TenTX: '',
    SDT: '',
    TenDangNhap: '',
    MatKhau: ''
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/drivers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setDrivers(data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      alert('Lỗi khi tải danh sách tài xế');
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

      if (editingDriver) {
        // Update
        const updateData = {
          TenTX: formData.TenTX,
          SDT: formData.SDT,
          TenDangNhap: formData.TenDangNhap
        };
        
        if (formData.MatKhau) {
          updateData.MatKhau = formData.MatKhau;
        }

        const response = await fetch(`${API_URL}/drivers/${editingDriver.MaTX}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(updateData)
        });

        if (response.ok) {
          alert('Cập nhật tài xế thành công!');
          fetchDrivers();
        } else {
          const error = await response.json();
          alert('Lỗi: ' + error.error);
        }
      } else {
        // Create
        const response = await fetch(`${API_URL}/drivers`, {
          method: 'POST',
          headers,
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const result = await response.json();
          alert(`Tạo tài xế thành công!\nTên đăng nhập: ${result.username}`);
          fetchDrivers();
        } else {
          const error = await response.json();
          alert('Lỗi: ' + error.error);
        }
      }

      setShowModal(false);
      setEditingDriver(null);
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      alert('Lỗi khi lưu tài xế');
    }
  };

  const handleEdit = async (driver) => {
    // Lấy thông tin tài khoản
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/drivers/${driver.MaTX}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      setEditingDriver(data);
      setFormData({
        MaTX: data.MaTX,
        TenTX: data.TenTX,
        SDT: data.SDT,
        TenDangNhap: data.TenDangNhap || '',
        MatKhau: ''
      });
      setShowModal(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Lỗi khi tải thông tin tài xế');
    }
  };

  const handleDelete = async (MaTX) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài xế này?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/drivers/${MaTX}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Xóa tài xế thành công!');
        fetchDrivers();
      } else {
        alert('Lỗi khi xóa tài xế');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Lỗi khi xóa tài xế');
    }
  };

  const resetForm = () => {
    setFormData({
      MaTX: '',
      TenTX: '',
      SDT: '',
      TenDangNhap: '',
      MatKhau: ''
    });
  };

  const filteredDrivers = drivers.filter(driver => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      driver.MaTX?.toLowerCase().includes(search) ||
      driver.TenTX?.toLowerCase().includes(search) ||
      driver.SDT?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý tài xế</h1>
          <p className="text-gray-600 mt-1">Danh sách và thông tin tài xế xe buýt ({filteredDrivers.length} tài xế)</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Thêm tài xế
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <input
          type="text"
          placeholder="Tìm kiếm tài xế (mã, tên, số điện thoại)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã TX</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên tài xế</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDrivers.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  {searchTerm ? 'Không tìm thấy tài xế phù hợp' : 'Chưa có tài xế nào'}
                </td>
              </tr>
            ) : (
              filteredDrivers.map((driver) => (
              <tr key={driver.MaTX} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{driver.MaTX}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      {driver.TenTX?.charAt(0)}
                    </div>
                    <div className="text-sm font-medium text-gray-900">{driver.TenTX}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="flex items-center gap-1">
                    <Phone size={14} /> {driver.SDT}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(driver)}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                    >
                      <Edit size={14} /> Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(driver.MaTX)}
                      className="text-red-600 hover:text-red-900 flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Xóa
                    </button>
                  </div>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">
              {editingDriver ? 'Sửa thông tin tài xế' : 'Thêm tài xế mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingDriver && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã tài xế <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.MaTX}
                    onChange={(e) => setFormData({...formData, MaTX: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên tài xế <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.TenTX}
                  onChange={(e) => setFormData({...formData, TenTX: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.SDT}
                  onChange={(e) => setFormData({...formData, SDT: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên đăng nhập <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.TenDangNhap}
                  onChange={(e) => setFormData({...formData, TenDangNhap: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  Mật khẩu {editingDriver && '(để trống nếu không đổi)'} {!editingDriver && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="password"
                  value={formData.MatKhau}
                  onChange={(e) => setFormData({...formData, MatKhau: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder={editingDriver ? "Nhập mật khẩu mới" : ""}
                  required={!editingDriver}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingDriver(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingDriver ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
