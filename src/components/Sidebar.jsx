import React from 'react';

export default function Sidebar({ active = 'overview', onSelect = () => {} }) {
  const nav = [
    { key: 'overview', label: 'Tổng quan', icon: '📊' },
    { key: 'students', label: 'Học sinh', icon: '👥' },
    { key: 'drivers', label: 'Tài xế', icon: '👤' },
    { key: 'buses', label: 'Xe buýt', icon: '🚌' },
    { key: 'routes', label: 'Tuyến đường', icon: '🗺️' },
    { key: 'tracking', label: 'Theo dõi', icon: '📍' },
    { key: 'parents', label: 'Phụ huynh', icon: '👪' },
    { key: 'settings', label: 'Cài đặt', icon: '⚙️' },
  ];

  return (
    <aside className="w-72 bg-white h-screen border-r relative">
      <div className="p-6 flex items-center gap-3 border-b">
        <div className="text-2xl">🚌</div>
        <div className="font-bold text-lg">BusManager</div>
      </div>
      <nav className="p-4">
        {nav.map((item) => {
          const isActive = active === item.key;
          return (
            <div
              key={item.key}
              onClick={() => onSelect(item.key)}
              role="button"
              tabIndex={0}
              className={`flex items-center gap-3 p-3 rounded-lg mb-2 cursor-pointer transition-colors select-none ${
                isActive ? 'bg-slate-900 text-white shadow' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="w-6 text-center">{item.icon}</div>
              <div className="font-medium">{item.label}</div>
            </div>
          );
        })}
      </nav>
      <div className="absolute bottom-6 left-6 text-rose-600 font-medium">Đăng xuất</div>
    </aside>
  );
}
