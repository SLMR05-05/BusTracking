import React, { useState, useEffect } from 'react';
import { Plus,  Phone, Search, X } from 'lucide-react';
import axios from "axios";

export default function ParentsManagement() {
  const [parents, setParents] = useState([]);
  const [childrenData, setChildrenData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    phone: '',
    address: '',
    status: 'active'
  });

  const API_URL = 'http://localhost:5000/api/parents';

  const fetchParents= async () => {
    try {
      const res = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      const formattedParents = res.data.map(parent => ({
        id: parent.MaPH,
        name: parent.TenPH,
        phone: parent.SDT,
        address: parent.DiaChi,
        status: parent.TrangThaiXoa === '0' ? 'active' : 'deleted'
      }));

      setParents(formattedParents);
      formattedParents.forEach(async (p) => {
        try {
          const childRes = await axios.get(`${API_URL}/${p.id}/children`);
          setChildrenData(prev => ({
            ...prev,
            [p.id]: childRes.data
          }));
        } catch (err) {
          console.error("Lỗi lấy học sinh:", err);
        }
      });
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phụ huynh', error);
    }
  }; 

  useEffect(() => {
      fetchParents();
    }, []);
    const filteredParents = parents.filter(p => {
    const search = searchText.trim().toLowerCase(); 
    return (
      p.name.toLowerCase().includes(search) ||
      p.phone.includes(search)
    );
  });
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (editingParent) {
        await axios.put(`${API_URL}/${editingParent.id}`, {
          TenPH: formData.name,
          SDT: formData.phone,
          DiaChi: formData.address
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

      } else {
        await axios.post(API_URL, {
          username: formData.username,
          password: formData.password || "12345",
          TenPH: formData.name,
          SDT: formData.phone,
          DiaChi: formData.address
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      fetchParents();
      setShowModal(false);
      setEditingParent(null);
      resetFormData();

    } catch (error) {
      console.error("Lỗi khi lưu phụ huynh:", error);
    }
  };



  const resetFormData = () => {
    setFormData({
      id: '',
      name: '',
      phone: '',
      address: '',
      status: 'active'
    });
  };

  const handleEdit = (parent) => {
    setEditingParent(parent);
    setFormData({
      id: parent.id, 
      name: parent.name,
      phone: parent.phone,
      address: parent.address,
      status: parent.status
    });
    setShowModal(true);
  };


  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phụ huynh này?')) {
      try {
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        fetchParents();
      } catch (error) {
        console.error('Lỗi khi xóa phụ huynh:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý phụ huynh</h1>
          <p className="text-gray-600 mt-1">Danh sách và thông tin phụ huynh trong hệ thống</p>
        </div>
        <button
          onClick={() => {
            resetFormData();      
            setEditingParent(null);  
            setShowModal(true);   
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        > 
          <Plus size={20} />
          Thêm phụ huynh
        </button>
      </div>

      {/* Search Parent */}
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

        </div>
      </div>      

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phụ huynh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa chỉ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Con
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredParents.map((parent) => (
                <tr key={parent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {parent.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{parent.name}</div>
                        <div className="text-sm text-gray-500">{parent.id}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone size={12} />
                          {parent.phone}
                        </div>
                      </div>
                    </div>
                    
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {parent.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {childrenData[parent.id] ? childrenData[parent.id].length : 0} học sinh

                    </div>
                    <div className="text-xs text-gray-500">
                      {childrenData[parent.id] &&
                        childrenData[parent.id].map(c => c.TenHS).join(', ')
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(parent)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(parent.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingParent ? 'Sửa thông tin tài xế' : 'Thêm tài xế mới'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

              {!editingParent && (
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

              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-xl font-semibold mb-3 text-green-600">
                  Thông tin
                </h3>

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
                    setEditingParent(null);
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
                  {editingParent ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


      

      