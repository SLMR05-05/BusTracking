import React from 'react';
import StatCard from '../components/StatCard';
import ActivityList from '../components/ActivityList';

export default function Overview() {
  const stats = [
    { title: 'Tổng học sinh', value: '1,247', meta: '+12% so với tháng trước' },
    { title: 'Xe buýt hoạt động', value: '24', meta: '100% so với tháng trước' },
    { title: 'Tài xế', value: '28', meta: '+2 so với tháng trước' },
    { title: 'Tuyến đường', value: '15', meta: 'Ổn định so với tháng trước' },
  ];

  const activities = [
    { text: 'Xe BS-001 đã hoàn thành lộ trình sáng', time: '10 phút trước', color: 'bg-green-500' },
    { text: 'Học sinh Nguyễn Văn An đã lên xe tại điểm dừng 2', time: '15 phút trước', color: 'bg-blue-500' },
    { text: 'Xe BS-003 bị chậm 5 phút do tắc đường', time: '20 phút trước', color: 'bg-orange-400' },
  ];

  return (
    <div>
      <section className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="min-h-[110px]"><StatCard {...s} /></div>
        ))}
      </section>

      <section className="grid grid-cols-3 gap-6">
        <div className="col-span-2"><ActivityList items={activities} /></div>
        <div className="col-span-1 bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="font-semibold mb-4">Thống kê hôm nay</h3>
          <ul className="text-sm text-slate-700 space-y-3">
            <li className="flex justify-between"><span>Tổng chuyến đi</span><span className="font-bold">48</span></li>
            <li className="flex justify-between"><span>Học sinh đã đưa đón</span><span className="font-bold">1,205</span></li>
            <li className="flex justify-between"><span>Thời gian trung bình</span><span className="font-bold">28 phút</span></li>
            <li className="flex justify-between"><span>Tỉ lệ đúng giờ</span><span className="font-bold text-green-600">96.5%</span></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
