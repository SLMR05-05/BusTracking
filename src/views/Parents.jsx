import React, { useState } from 'react';

export default function Parents() {
  const [tab, setTab] = useState('tracking');

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm text-slate-500">Phụ huynh: <span className="font-semibold">Nguyễn Thị Hoa</span></div>
          <div className="text-xs text-slate-400">Con: Nguyễn Văn An</div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm text-slate-600 hover:underline">Đăng xuất</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-full p-1 mb-6 shadow-sm border">
        <div className="flex items-center gap-2 px-1">
          {['tracking','info','history'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm ${tab===t ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
            >
              {t==='tracking' ? 'Theo dõi xe' : t==='info' ? 'Thông tin' : 'Lịch sử'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {tab === 'tracking' && (
        <div className="space-y-6">
          {/* Status card */}
          <div className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs">Trạng thái xe buýt</div>
                <div className="text-lg font-bold mt-2">Xe BS-001 - Tuyến A</div>
                <div className="text-sm opacity-90 mt-1">Vị trí hiện tại: Đang ở Xuân Thủy</div>
              </div>
              <div className="text-right">
                <div className="text-sm">Tốc độ</div>
                <div className="text-2xl font-bold">25 km/h</div>
              </div>
            </div>

            <div className="mt-4 flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">📍</div>
                <div>
                  <div className="text-xs">Vị trí hiện tại</div>
                  <div className="font-medium">Đang ở Xuân Thủy</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">⏱️</div>
                <div>
                  <div className="text-xs">Thời gian đến</div>
                  <div className="font-medium">5 phút</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">📏</div>
                <div>
                  <div className="text-xs">Khoảng cách</div>
                  <div className="font-medium">1.2 km</div>
                </div>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="bg-white rounded-xl p-8 shadow-sm border h-56 flex flex-col items-center justify-center text-slate-500">
            <div className="text-4xl text-pink-500 mb-3">📍</div>
            <div className="font-medium">Bản đồ theo dõi thời gian thực</div>
            <div className="text-sm mt-1">Điểm đón: 22 Lê Duẩn — Điểm đến: 22 Lê Duẩn</div>
            <div className="mt-4 inline-block bg-pink-50 text-pink-600 px-3 py-2 rounded">Xe đang di chuyển đến điểm đón của bạn</div>
          </div>

          {/* Notifications */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Thông báo</h3>
            <div className="space-y-3">
              <div className="bg-emerald-50 border-l-4 border-emerald-300 p-4 rounded"> 
                <div className="text-sm text-emerald-700 font-medium">Xe buýt đã đón con</div>
                <div className="text-xs text-slate-500">Con của bạn đã được đón lên xe lúc 06:45</div>
              </div>

              <div className="bg-sky-50 border-l-4 border-sky-300 p-4 rounded"> 
                <div className="text-sm text-sky-700 font-medium">Xe buýt sắp đến</div>
                <div className="text-xs text-slate-500">Xe buýt sẽ đến điểm trong 5 phút</div>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-300 p-4 rounded"> 
                <div className="text-sm text-amber-700 font-medium">Thông báo lịch nghỉ</div>
                <div className="text-xs text-slate-500">Xe nghỉ chạy ngày 05/10 do lễ Quốc khánh</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'info' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">Thông tin phụ huynh / học sinh - (demo)</div>
      )}

      {tab === 'history' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">Lịch sử chuyến đi - (demo)</div>
      )}
    </div>
  );
}
