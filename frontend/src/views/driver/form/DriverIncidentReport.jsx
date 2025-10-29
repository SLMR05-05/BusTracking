import React, { useState } from "react";
import { X, Send, Camera } from "lucide-react";

export default function IncidentReportModal({ onClose, onSubmit }) {
  const [type, setType] = useState("Tai nạn");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const report = {
      type,
      description,
      file,
      time: new Date().toISOString(),
    };
    onSubmit(report);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative">
        {/* Header */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold">Báo cáo sự cố</h2>
        <p className="text-gray-500 text-sm mb-4">
          Vui lòng mô tả chi tiết tình huống đang gặp phải
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Loại sự cố */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Loại sự cố <span className="text-red-500">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option>Tai nạn</option>
              <option>Kẹt xe</option>
              <option>Hỏng xe</option>
              <option>Thời tiết xấu</option>
              <option>Khác</option>
            </select>
          </div>

          {/* Mô tả chi tiết */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Mô tả chi tiết <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Mô tả tình huống, vị trí, mức độ nghiêm trọng..."
              required
            />
          </div>

          {/* Đính kèm ảnh */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Đính kèm ảnh (tùy chọn)
            </label>
            <label className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50">
              <Camera size={18} />
              <span>Chọn ảnh</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            {file && (
              <p className="text-xs text-gray-500 mt-1">
                Ảnh đã chọn: {file.name}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              <Send size={16} /> Gửi báo cáo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
