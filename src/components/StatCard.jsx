import React from 'react';

export default function StatCard({ title, value, meta }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-3xl font-extrabold mt-4 text-slate-900">{value}</div>
      {meta && <div className="text-sm text-green-500 mt-2">{meta}</div>}
    </div>
  );
}
