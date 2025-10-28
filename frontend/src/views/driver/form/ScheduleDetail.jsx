import React from "react";
import { X } from "lucide-react";

export default function ScheduleDetailModal({ onClose, schedule }) {
  if (!schedule) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold mb-4">
          Chi tiết lịch trình - {schedule.shift}
        </h2>

        {/* Thông tin tổng quan */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-blue-50 rounded-xl p-3">
            <p className="text-gray-500 text-sm">Mã lịch trình</p>
            <p className="font-medium">{schedule.scheduleId}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3">
            <p className="text-gray-500 text-sm">Tuyến đường</p>
            <p className="font-medium">{schedule.routeName}</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-3">
            <p className="text-gray-500 text-sm">Khởi hành</p>
            <p className="font-medium">
              {new Date(schedule.startTime).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="bg-orange-50 rounded-xl p-3">
            <p className="text-gray-500 text-sm">Kết thúc</p>
            <p className="font-medium">
              {new Date(schedule.endTime).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Danh sách trạm */}
        <h3 className="font-semibold text-base mb-3">Các trạm dừng</h3>
        <div className="space-y-3">
          {schedule.stops.map((stop, idx) => (
            <div
              key={stop.id}
              className="flex justify-between items-center border rounded-xl p-3 bg-gray-50 hover:bg-gray-100 transition"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    {idx + 1}
                  </span>
                  <p className="font-medium">{stop.name}</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  ETA: {stop.eta} - {stop.students} học sinh
                </p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  stop.status === "Chưa đến"
                    ? "bg-gray-200 text-gray-600"
                    : stop.status === "Đang đến"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {stop.status}
              </span>
            </div>
          ))}
        </div>

        {/* Nút đóng */}
        <div className="flex justify-end mt-6">
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
