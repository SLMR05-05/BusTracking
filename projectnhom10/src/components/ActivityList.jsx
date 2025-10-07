import React from 'react';

export default function ActivityList({ items }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h3 className="font-semibold mb-4 text-lg">Hoạt động gần đây</h3>
      <ul className="space-y-4">
        {items.map((it, i) => (
          <li key={i} className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <span className={`w-3.5 h-3.5 rounded-full mt-1 ${it.color}`}></span>
              <span className="text-sm text-slate-700">{it.text}</span>
            </div>
            <div className="text-sm text-slate-400">{it.time}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
