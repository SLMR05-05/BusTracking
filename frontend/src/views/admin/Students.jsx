// src/components/Students.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, UserCheck, X, Plus, Phone, User, Search } from "lucide-react";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [parentSearchTerm, setParentSearchTerm] = useState("");
  const [showParentDropdown, setShowParentDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    grade: "",
    phone: "",
    parentId: "",
    routeId: "", // chỉ dùng để lọc UI stops
    stopId: "",
  });

  const API_BASE = "http://localhost:5000/api";
  const API_URL_STUDENTS = `${API_BASE}/students`;
  const API_URL_PARENTS = `${API_BASE}/parents`;
  const API_URL_ROUTES = `${API_BASE}/routes`;
  const API_URL_STOPS = `${API_BASE}/stops`;

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL_STUDENTS, { headers: getAuthHeaders() });
      const formatted = (res.data || []).map((s) => ({
        id: s.MaHS,
        parentId: s.MaPH,
        stopId: s.MaTram,
        name: s.TenHS,
        phone: s.SDT,
        grade: s.Lop,
        status: s.TrangThaiXoa === 0 || s.TrangThaiXoa === "0" ? "active" : "deleted",
      }));
      setStudents(formatted);
    } catch (err) {
      console.error("Lỗi khi lấy students:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchParents = async () => {
    try {
      const res = await axios.get(API_URL_PARENTS, { headers: getAuthHeaders() });
      const formatted = (res.data || []).map((p) => ({
        id: p.MaPH,
        name: p.TenPH,
        phone: p.SDT,
        raw: p,
      }));
      setParents(formatted);
    } catch (err) {
      console.error("Lỗi khi lấy parents:", err);
    }
  };

  const fetchRoutes = async () => {
    try {
      const res = await axios.get(API_URL_ROUTES, { headers: getAuthHeaders() });
      const formatted = (res.data || []).map((r) => ({
        id: r.MaTD,
        name: r.TenTuyenDuong || `${r.BatDau || ""} → ${r.KetThuc || ""}`,
        raw: r,
      }));
      setRoutes(formatted);
    } catch (err) {
      console.error("Lỗi khi lấy routes:", err);
    }
  };

  const fetchStops = async () => {
    try {
      const res = await axios.get(API_URL_STOPS, { headers: getAuthHeaders() });
      const formatted = (res.data || []).map((t) => ({
        id: t.MaTram,
        routeId: t.MaTD || "", // nếu không có routeId, để rỗng
        name: t.TenTram,
        lat: t.ViDo,
        lng: t.KinhDo,
        address: t.DiaChi || "",
        raw: t,
      }));
      setStops(formatted);
    } catch (err) {
      console.error("Lỗi khi lấy stops:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchParents();
    fetchRoutes();
    fetchStops();
  }, []);

  const filteredStudents = students.filter((s) => {
    const q = (searchText || "").trim().toLowerCase();
    if (!q) return true;
    return (
      (s.name || "").toLowerCase().includes(q) ||
      (s.phone || "").includes(q) ||
      (s.id || "").toString().toLowerCase().includes(q)
    );
  });

  const filteredParents = parents.filter((p) => {
    const q = (parentSearchTerm || "").trim().toLowerCase();
    if (!q) return true;
    return (
      (p.name || "").toLowerCase().includes(q) ||
      (p.phone || "").includes(q) ||
      (p.address || "").toLowerCase().includes(q)
    );
  });

  const getParentInfo = (parentId) => {
    if (!parentId) return { name: "Chưa có", phone: "" };
    const p = parents.find((x) => x.id === parentId);
    return p ? { name: p.name, phone: p.phone } : { name: "Không tìm thấy", phone: "" };
  };

  const getStopInfo = (stopId) => {
    if (!stopId) return "Chưa chọn";
    const s = stops.find((x) => x.id === stopId);
    return s ? s.name : "Không tìm thấy";
  };

  const getAvailableStops = (routeId) => {
    if (!routeId) return stops; // nếu routeId không chọn, trả tất cả
    return stops.filter((s) => s.routeId === routeId);
  };

  const openAddModal = () => {
    resetFormData();
    setEditingStudent(null);
    setShowModal(true);
    setParentSearchTerm("");
    setShowParentDropdown(false);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      id: student.id || "",
      name: student.name || "",
      grade: student.grade || "",
      phone: student.phone || "",
      parentId: student.parentId || "",
      routeId: "", // chỉ dùng UI
      stopId: student.stopId || "",
    });

    if (student.stopId) {
      const stop = stops.find((st) => st.id === student.stopId);
      if (stop) {
        setFormData((prev) => ({ ...prev, routeId: stop.routeId || "" }));
      }
    }

    setShowModal(true);
    setParentSearchTerm(parents.find((p) => p.id === student.parentId)?.name || "");
    setShowParentDropdown(false);
  };

  const resetFormData = () => {
    setFormData({
      id: "",
      name: "",
      grade: "",
      phone: "",
      parentId: "",
      routeId: "",
      stopId: "",
    });
  };

  const handleSelectParent = (parent) => {
    setFormData((prev) => ({ ...prev, parentId: parent.id }));
    setParentSearchTerm(parent.name);
    setShowParentDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Tên học sinh không được bỏ trống");
      return;
    }
    if (!formData.parentId) {
      alert("Vui lòng chọn phụ huynh");
      return;
    }
    if (!formData.stopId) {
      alert("Vui lòng chọn trạm đón");
      return;
    }

    try {
      const payload = {
        TenHS: formData.name,
        Lop: formData.grade,
        MaPH: formData.parentId,
        MaTram: formData.stopId,
        SDT: formData.phone,
      };

      if (editingStudent && editingStudent.id) {
        await axios.put(`${API_URL_STUDENTS}/${editingStudent.id}`, payload, { headers: getAuthHeaders() });
      } else {
        await axios.post(API_URL_STUDENTS, payload, { headers: getAuthHeaders() });
      }

      await fetchStudents();
      setShowModal(false);
      setEditingStudent(null);
      resetFormData();
    } catch (err) {
      console.error("Lỗi khi lưu học sinh:", err);
      alert("Lỗi khi lưu học sinh. Kiểm tra console để biết thêm chi tiết.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa học sinh này?")) return;
    try {
      await axios.delete(`${API_URL_STUDENTS}/${id}`, { headers: getAuthHeaders() });
      await fetchStudents();
    } catch (err) {
      console.error("Lỗi khi xóa học sinh:", err);
      alert("Xóa không thành công. Kiểm tra console để biết thêm chi tiết.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý học sinh</h1>
          <p className="text-gray-600 mt-1">Danh sách và thông tin học sinh</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Thêm học sinh
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm theo tên, SĐT hoặc mã HS..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchText && (
              <button
                onClick={() => setSearchText("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Học sinh</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lớp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phụ huynh</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm đón</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SĐT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={6} className="p-6 text-center">Đang tải...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center">Không có học sinh</td></tr>
              ) : (
                filteredStudents.map((student) => {
                  const parentInfo = getParentInfo(student.parentId);
                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                            {(student.name || " ").charAt(0) || "H"}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.grade}</td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-green-500" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{parentInfo.name}</div>
                            {parentInfo.phone && (
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Phone size={12} /> {parentInfo.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getStopInfo(student.stopId)}</td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.phone}</td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(student)} className="text-blue-600 hover:text-blue-900">Sửa</button>
                          <button onClick={() => handleDelete(student.id)} className="text-red-600 hover:text-red-900">Xóa</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingStudent ? "Sửa thông tin học sinh" : "Thêm học sinh mới"}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lớp</label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData((p) => ({ ...p, grade: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              
              {/* Parent search/select */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phụ huynh <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={parentSearchTerm}
                  onChange={(e) => {
                    setParentSearchTerm(e.target.value);
                    setShowParentDropdown(true);
                    if (!e.target.value) setFormData((p) => ({ ...p, parentId: "" }));
                  }}
                  onFocus={() => setShowParentDropdown(true)}
                  placeholder="Tìm theo tên hoặc SĐT..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                {showParentDropdown && parentSearchTerm && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                    {filteredParents.length > 0 ? (
                      filteredParents.map((parent) => (
                        <div
                          key={parent.id}
                          onClick={() => handleSelectParent(parent)}
                          className={`px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 ${formData.parentId === parent.id ? "bg-blue-100" : ""}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {parent.name?.charAt(0) || "P"}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{parent.name}</div>
                              <div className="text-sm text-gray-600 flex items-center gap-2">
                                <Phone size={12} /> {parent.phone}
                                <span className="text-gray-400">•</span>
                                <span className="text-xs text-gray-500">{parent.address}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500 text-center">Không tìm thấy phụ huynh</div>
                    )}
                  </div>
                )}

                {/* selected parent badge */}
                {formData.parentId && !showParentDropdown && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <UserCheck size={16} className="text-green-600" />
                      <span className="text-sm text-green-800 font-medium">
                        Đã chọn: {parents.find((p) => p.id === formData.parentId)?.name || "Không tìm thấy"}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((p) => ({ ...p, parentId: "" }));
                          setParentSearchTerm("");
                        }}
                        className="ml-3 text-sm text-gray-500 hover:text-gray-700"
                      >
                        Bỏ chọn
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Route & Stop */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tuyến xe <span className="text-red-500">*</span></label>
                  <select
                    value={formData.routeId}
                    onChange={(e) => setFormData((p) => ({ ...p, routeId: e.target.value, stopId: "" }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Chọn tuyến xe</option>
                    {routes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạm đón <span className="text-red-500">*</span></label>
                  <select
                    value={formData.stopId}
                    onChange={(e) => setFormData((p) => ({ ...p, stopId: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!formData.routeId}
                  >
                    <option value="">{formData.routeId ? "Chọn trạm đón" : "Chọn tuyến trước"}</option>
                    {getAvailableStops(formData.routeId).map((stop) => (
                      <option key={stop.id} value={stop.id}>
                        {stop.name} - {stop.address}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingStudent(null);
                    resetFormData();
                    setParentSearchTerm("");
                    setShowParentDropdown(false);
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {editingStudent ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
