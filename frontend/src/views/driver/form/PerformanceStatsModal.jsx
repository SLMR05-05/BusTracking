import React, { useState } from "react";
import { X } from "lucide-react";

export default function PerformanceStatsModal({ onClose, stats }) {
  const [activeTab, setActiveTab] = useState("today");

  const tabData = {
    today: stats.today,
    week: stats.week,
    month: stats.month,
  };

  const current = tabData[activeTab];

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* Tiêu đề */}
        <h2 className="text-lg font-semibold mb-4">Thống kê hiệu suất</h2>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-full overflow-hidden mb-6 text-sm font-medium">
          <button
            className={`flex-1 py-2 transition ${
              activeTab === "today"
                ? "bg-white text-black shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("today")}
          >
            Hôm nay
          </button>
          <button
            className={`flex-1 py-2 transition ${
              activeTab === "week"
                ? "bg-white text-black shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("week")}
          >
            Tuần này
          </button>
          <button
            className={`flex-1 py-2 transition ${
              activeTab === "month"
                ? "bg-white text-black shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("month")}
          >
            Tháng này
          </button>
        </div>

        {/* Nội dung thống kê */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-gray-600 text-sm">Chuyến đi</p>
            <p className="text-blue-700 text-xl font-semibold">{current.trips}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-gray-600 text-sm">Học sinh</p>
            <p className="text-green-700 text-xl font-semibold">
              {current.students}
            </p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-gray-600 text-sm">Km đã đi</p>
            <p className="text-purple-700 text-xl font-semibold">
              {current.distance}
            </p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4">
            <p className="text-gray-600 text-sm">Đúng giờ</p>
            <p className="text-orange-700 text-xl font-semibold">
              {current.onTime}%
            </p>
          </div>
        </div>

        {/* Nút đóng */}
        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-800"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
