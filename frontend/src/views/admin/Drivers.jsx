import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, UserCheck, UserX, Plus, Calendar, Phone, CreditCard, Search, X } from 'lucide-react';


export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    driverId: '',
    phone: '',
    SCCCD: '',         
    licenseNumber: '',
    address: '',
    status: 'active'
  });

  // URL backend API
  const API_URL = 'http://localhost:5000/api/drivers';

  // Lấy danh sách tài xế từ backend
  const fetchDrivers = async () => {
    try {
      const res = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      const formattedDrivers = res.data.map(driver => ({
        id: driver.MaTX,
        name: driver.TenTX,
        phone: driver.SDT,
        SCCCD: driver.SCCCD,         
        licenseNumber: driver.BangLai,
        address: driver.DiaChi,
        status: driver.TrangThaiXoa === '0' ? 'active' : 'deleted'
      }));

      setDrivers(formattedDrivers);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tài xế:', error);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);
  const filteredDrivers = drivers.filter(d => {
  const search = searchText.trim().toLowerCase(); 
  return (
    d.name.toLowerCase().includes(search) ||
    d.phone.includes(search)
  );
});
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (editingDriver) {
        // Update tài xế
        await axios.put(`${API_URL}/${editingDriver.id}`, {
          TenTX: formData.name,
          SDT: formData.phone,
          SCCCD: formData.SCCCD,
          BangLai: formData.licenseNumber,
          DiaChi: formData.address
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

      } else {
        // Tạo tài xế mới – backend tự sinh MaTK, MaTX
        await axios.post(API_URL, {
          username: formData.username,
          password: formData.password || "12345",
          TenTX: formData.name,
          SDT: formData.phone,
          SCCCD: formData.SCCCD,
          BangLai: formData.licenseNumber,
          DiaChi: formData.address
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      fetchDrivers();
      setShowModal(false);
      setEditingDriver(null);
      resetFormData();

    } catch (error) {
      console.error("Lỗi khi lưu tài xế:", error);
    }
  };



  const resetFormData = () => {
    setFormData({
      name: '',
      driverId: '',
      phone: '',
      SCCCD: '',         
      licenseNumber: '',
      experience: '',
      address: '',
      status: 'active'
    });
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      driverId: driver.id,  // <-- fix
      phone: driver.phone,
      SCCCD: driver.SCCCD,
      licenseNumber: driver.licenseNumber,
      address: driver.address,
      status: driver.status
    });
    setShowModal(true);
  };


  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài xế này?')) {
      try {
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        fetchDrivers();
      } catch (error) {
        console.error('Lỗi khi xóa tài xế:', error);
      }
    }
  };

  return (
    
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý tài xế</h1>
          <p className="text-gray-600 mt-1">Danh sách và thông tin tài xế xe buýt</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Thêm tài xế
        </button>
      </div>
      {/* Search Driver */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />

            <input
              type="text"
              placeholder="Tìm theo tên hoặc số điện thoại..."
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

          <div className="text-sm text-gray-600">
            Tìm thấy <span className="font-bold text-blue-600">{filteredDrivers.length}</span> tài xế
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tài xế
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SCCCD
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bằng lái
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kinh nghiệm
                </th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa chỉ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDrivers.map((driver) => (

                <tr key={driver.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {driver.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                        <div className="text-sm text-gray-500">{driver.driverId}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone size={12} />
                          {driver.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {driver.SCCCD || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap ">
                    {driver.licenseNumber || '-'}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {driver.experience || '-'}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {driver.address || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(driver)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(driver.id)}
                        className="text-red-600 hover:text-red-900"
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
      </div>

      {/* Add/Edit Driver Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingDriver ? 'Sửa thông tin tài xế' : 'Thêm tài xế mới'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* PHẦN 1: TẠO TÀI KHOẢN */}
              {!editingDriver && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="text-xl font-semibold mb-3 text-blue-600">
                    Tài khoản
                  </h3>

                  <div className="grid grid-cols-2 gap-4">

                    <div>
                      <label className="block text-sm font-medium mb-1">Tài khoản</label>
                      <input
                        type="text"
                        value={formData.username || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        placeholder="Nhập tên đăng nhập"
                        className="w-full border p-2 rounded-lg"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                      <input
                        type="text"
                        value={formData.password || "12345"}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="w-full border p-2 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PHẦN 2: THÔNG TIN TÀI XẾ */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-xl font-semibold mb-3 text-green-600">
                  Thông tin
                </h3>

                {/* Dòng 1: Họ và tên */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Họ và tên</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border p-2 rounded-lg"
                    required
                  />
                </div>

                  {/* Dòng 2: Số điện thoại */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border p-2 rounded-lg"
                      required
                    />
                  </div>
                </div>
                

                {/* Dòng 3: SCCCD + Bằng lái */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Số CCCD</label>
                    <input
                      type="text"
                      value={formData.SCCCD}
                      onChange={(e) => setFormData({ ...formData, SCCCD: e.target.value })}
                      className="w-full border p-2 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Bằng lái</label>
                    <input
                      type="text"
                      value={formData.licenseNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, licenseNumber: e.target.value })
                      }
                      className="w-full border p-2 rounded-lg"
                    />
                  </div>
                </div>

                {/* Dòng 4: Địa chỉ */}
                <div>
                  <label className="block text-sm font-medium mb-1">Địa chỉ</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full border p-2 rounded-lg"
                  />
                </div>
              </div>


              {/* BUTTONS */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingDriver(null);
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
