import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Plus } from "lucide-react";

export default function Station() {
  const [stations, setStations] = useState([
    { id: 1, code: "TR001", name: "Trạm Nguyễn Văn Cừ", address: "Nguyễn Văn Cừ, Quận 5", lat: 10.762622, lng: 106.682223 },
    { id: 2, code: "TR002", name: "Trạm Lê Văn Việt", address: "Lê Văn Việt, Quận 9", lat: 10.845321, lng: 106.794222 },
    { id: 3, code: "TR003", name: "Trạm Nguyễn Thị Minh Khai", address: "Nguyễn Thị Minh Khai, Q1", lat: 10.776111, lng: 106.695833 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    address: "",
    lat: "",
    lng: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStation) {
      setStations(
        stations.map((s) =>
          s.id === editingStation.id ? { ...s, ...formData } : s
        )
      );
    } else {
      const newStation = {
        id: Math.max(...stations.map((s) => s.id)) + 1,
        ...formData,
      };
      setStations([...stations, newStation]);
    }
    setShowModal(false);
    setEditingStation(null);
    setFormData({ code: "", name: "", address: "", lat: "", lng: "" });
  };

  const handleEdit = (station) => {
    setEditingStation(station);
    setFormData(station);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa trạm này?")) {
      setStations(stations.filter((s) => s.id !== id));
    }
  };

  const handleMapClick = async (lat, lng) => {
    setFormData((prev) => ({ ...prev, lat, lng }));

    // Gọi Nominatim API để lấy địa chỉ từ toạ độ
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      if (data.display_name) {
        setFormData((prev) => ({ ...prev, address: data.display_name }));
      } else {
        setFormData((prev) => ({ ...prev, address: "Không tìm thấy địa chỉ" }));
      }
    } catch (err) {
      setFormData((prev) => ({ ...prev, address: "Lỗi khi lấy địa chỉ" }));
    }
  };

  // Component con để xử lý click trên bản đồ
  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        handleMapClick(e.latlng.lat, e.latlng.lng);
      },
    });
    return formData.lat && formData.lng ? (
      <Marker position={[formData.lat, formData.lng]} />
    ) : null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Trạm</h1>
          <p className="text-gray-600 mt-1">Danh sách các trạm trong hệ thống</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Thêm trạm
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã trạm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên trạm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tọa độ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stations.map((station) => (
                <tr key={station.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{station.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{station.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{station.address}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {station.lat.toFixed(6)}, {station.lng.toFixed(6)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(station)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(station.id)}
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

      {/* Modal thêm/sửa trạm */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingStation ? "Sửa trạm" : "Thêm trạm mới"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã trạm
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên trạm
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={formData.address}
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                  placeholder="Chọn vị trí trên bản đồ để tự động điền"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tọa độ
                </label>
                <input
                  type="text"
                  value={
                    formData.lat && formData.lng
                      ? `${formData.lat.toFixed(6)}, ${formData.lng.toFixed(6)}`
                      : ""
                  }
                  readOnly
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                  placeholder="Chọn vị trí trên bản đồ để tự động điền"
                />
              </div>

              {/* Bản đồ chọn vị trí */}
              <div className="h-64 w-full rounded-lg overflow-hidden">
                <MapContainer
                  center={[10.7769, 106.7009]}
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

              <div className="flex justify-end gap-3 pt-4">
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
