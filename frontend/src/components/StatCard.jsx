import React from 'react';

export default function StatCard({ title, value, meta, icon: IconComponent, color }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-500 font-medium">{title}</div>
        {IconComponent && (
          <div className={`w-10 h-10 rounded-lg ${color || 'bg-gray-500'} flex items-center justify-center text-white`}>
            <IconComponent size={20} />
          </div>
        )}
      </div>
      <div className="text-3xl font-extrabold text-gray-900 mb-2">{value}</div>
      {meta && <div className="text-sm text-gray-600">{meta}</div>}
    </div>
  );
}
