import React, { useState, useMemo } from 'react';

export default function Parents() {
  const initial = [
    {
      id: 1,
      name: 'Nguyễn Văn An',
      bus: 'BS-001',
      status: 'onboard',
      pickupTime: '07:10',
      pickupPoint: 'Cổng trường A',
      dropoffPoint: 'Nhà An',
      eta: '07:45',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      bus: 'BS-002',
      status: 'waiting',
      pickupTime: '07:20',
      pickupPoint: 'Điểm dừng 3',
      dropoffPoint: 'Nhà B',
      eta: '07:55',
    },
    {
      id: 3,
      name: 'Lê Văn C',
      bus: 'BS-001',
      status: 'dropped',
      pickupTime: '06:40',
      pickupPoint: 'Cổng trường B',
      dropoffPoint: 'Nhà C',
      eta: '07:15',
    },
  ];

  const [kids] = useState(initial);
  const [filter, setFilter] = useState('all');
  const [openId, setOpenId] = useState(null);

  const filtered = useMemo(() => {
    if (filter === 'all') return kids;
    return kids.filter((k) => k.status === filter);
  }, [kids, filter]);

  const statusLabel = (s) => {
    if (s === 'onboard') return 'Đã lên xe';
    if (s === 'waiting') return 'Chưa lên xe';
    if (s === 'dropped') return 'Đã xuống';
    return s;
  };

  const statusClass = (s) => {
    if (s === 'onboard') return 'text-green-600';
    if (s === 'waiting') return 'text-amber-600';
    if (s === 'dropped') return 'text-slate-600';
    return '';
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Phụ huynh</h2>
      <p className="text-slate-600 mb-6">Danh sách con và trạng thái chuyến đi (demo).</p>

      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm text-slate-600">Lọc trạng thái:</label>
        <select className="border rounded p-2 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tất cả</option>
          <option value="waiting">Chưa lên xe</option>
          <option value="onboard">Đã lên xe</option>
          <option value="dropped">Đã xuống</option>
        </select>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="p-3">Học sinh</th>
              <th className="p-3">Xe buýt</th>
              <th className="p-3">Đón lúc</th>
              <th className="p-3">Điểm đón</th>
              <th className="p-3">ETA</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((k) => (
              <React.Fragment key={k.id}>
                <tr className="border-t">
                  <td className="p-3">{k.name}</td>
                  <td className="p-3">{k.bus}</td>
                  <td className="p-3">{k.pickupTime}</td>
                  <td className="p-3">{k.pickupPoint}</td>
                  <td className="p-3">{k.eta}</td>
                  <td className={`p-3 font-medium ${statusClass(k.status)}`}>{statusLabel(k.status)}</td>
                  <td className="p-3">
                    <button
                      className="text-sm text-sky-600 hover:underline"
                      onClick={() => setOpenId(openId === k.id ? null : k.id)}
                    >
                      {openId === k.id ? 'Đóng' : 'Chi tiết'}
                    </button>
                  </td>
                </tr>

                {openId === k.id && (
                  <tr>
                    <td colSpan={7} className="p-4 bg-slate-50 text-sm text-slate-700">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-slate-500">Địa chỉ đón</div>
                          <div className="font-medium">{k.pickupPoint}</div>
                        </div>
                        <div>
                          <div className="text-slate-500">Địa chỉ trả</div>
                          <div className="font-medium">{k.dropoffPoint}</div>
                        </div>
                        <div>
                          <div className="text-slate-500">Thời gian đón</div>
                          <div className="font-medium">{k.pickupTime}</div>
                        </div>
                        <div>
                          <div className="text-slate-500">Thời gian ước tính đến</div>
                          <div className="font-medium">{k.eta}</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
