import { Fullscreen } from "lucide-react";
import React, { useEffect, useState } from "react";

const mockSchedule = [
  {
    id: "trip-1",
    route: "Tuyến 1",
    code: "BS-001",
    startTime: "06:30",
    endTime: "07:30",
    distance: "12.4 km",
    driver: "Trần Văn Tài",
    vehicle: "51B-12345",
    stops: [
      { name: "Điểm 1 - Trường A", eta: "06:30", students: 6, visited: false },
      { name: "Điểm 2 - Đường Nguyễn Huệ", eta: "06:50", students: 6, visited: false },
      { name: "Điểm 3 - Trường B", eta: "07:20", students: 6, visited: false },
    ],
    students: 18,
    status: "completed",
    notes: "Không có sự cố, di chuyển đúng giờ.",
  },
  {
    id: "trip-2",
    route: "Tuyến 2",
    code: "BS-002",
    startTime: "07:45",
    endTime: "08:45",
    distance: "15.8 km",
    driver: "Trần Văn Tài",
    vehicle: "51B-67890",
    stops: [
      { name: "Điểm A - Nhà 1", eta: "07:45", students: 8, visited: false },
      { name: "Điểm B - Nhà 2", eta: "08:05", students: 7, visited: false },
      { name: "Điểm C - Trường D", eta: "08:35", students: 7, visited: false },
    ],
    students: 22,
    status: "on-trip",
    notes: "Đang di chuyển qua đoạn đường đông xe.",
  },
  {
    id: "trip-3",
    route: "Tuyến 3",
    code: "BS-003",
    startTime: "09:30",
    endTime: "10:15",
    distance: "10.2 km",
    driver: "Trần Văn Tài",
    vehicle: "51B-98765",
    stops: [
      { name: "Điểm 1 - Công viên 23/9", eta: "09:30", students: 5, visited: false },
      { name: "Điểm 2 - Chợ Lớn", eta: "09:50", students: 6, visited: false },
      { name: "Điểm 3 - Trường E", eta: "10:10", students: 5, visited: false },
    ],
    students: 16,
    status: "pending",
    notes: "Chuyến kế tiếp, dự kiến khởi hành sau 30 phút.",
  },
];

export default function DriverSchedule() {
  const [trips, setTrips] = useState(() => {
    try {
      const saved = localStorage.getItem("driver_trips_v1");
      return saved ? JSON.parse(saved) : mockSchedule;
    } catch {
      return mockSchedule;
    }
  });
  const [selected, setSelected] = useState(null);
  const [now, setNow] = useState(new Date());

  // UI controls
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | pending | on-trip | completed
  const [sortBy, setSortBy] = useState("startAsc"); // startAsc | startDesc

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("driver_trips_v1", JSON.stringify(trips));
    } catch {}
  }, [trips]);

  const startTrip = (id) =>
    setTrips((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "on-trip" } : t))
    );

  const completeTrip = (id) =>
    setTrips((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: "completed", stops: t.stops.map((s) => ({ ...s, visited: true })) }
          : t
      )
    );

  const toggleDetails = (id) => setSelected((s) => (s === id ? null : id));

  const isUpcoming = (startTime) => {
    const [h, m] = startTime.split(":").map(Number);
    const t = new Date(now);
    t.setHours(h, m, 0, 0);
    const diff = (t - now) / 60000;
    return diff > 0 && diff <= 45;
  };

  // Mark a stop visited/unvisited
  const toggleStopVisited = (tripId, stopIndex) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        const stops = t.stops.map((s, i) => (i === stopIndex ? { ...s, visited: !s.visited } : s));
        return { ...t, stops };
      })
    );
  };

  // Helpers
  const pad2 = (n) => (String(n).length === 1 ? "0" + n : String(n));
  const addMinutes = (date, mins) => new Date(date.getTime() + mins * 60000);
  const formatTime = (d) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

  // Estimate arrival by remaining stops (simple heuristic: 6 min per remaining stop)
  const getEstimatedArrival = (trip) => {
    const remaining = trip.stops.filter((s) => !s.visited).length;
    const ETA = addMinutes(now, remaining * 6 + 5); // base + per-stop
    return formatTime(ETA);
  };

  // Export visible trips to CSV
  const exportCsv = (visibleTrips) => {
    const rows = [
      ["id", "route", "code", "startTime", "endTime", "vehicle", "driver", "distance", "students", "status", "notes"],
      ...visibleTrips.map((t) => [
        t.id,
        t.route,
        t.code,
        t.startTime,
        t.endTime,
        t.vehicle,
        t.driver,
        t.distance,
        t.students,
        t.status,
        (t.notes || "").replace(/\n/g, " "),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trips_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtering and sorting
  const filtered = trips
    .filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        t.route.toLowerCase().includes(q) ||
        t.code.toLowerCase().includes(q) ||
        t.vehicle.toLowerCase().includes(q) ||
        (t.driver || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const [ah, am] = a.startTime.split(":").map(Number);
      const [bh, bm] = b.startTime.split(":").map(Number);
      const at = ah * 60 + am;
      const bt = bh * 60 + bm;
      return sortBy === "startAsc" ? at - bt : bt - at;
    });

  // Styles
  const container = {
    maxWidth: Fullscreen,
    margin: "24px auto",
    padding: 16,
    fontFamily: "Segoe UI, Roboto, sans-serif",
  };

  const card = {
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    border: "1px solid #e5e7eb",
  };

  const btn = {
    padding: "8px 12px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: 500,
  };

  return (
    <div style={container}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>📅 Lịch trình tài xế</h1>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <div style={{ color: "#6b7280" }}>
          Thời gian hiện tại: {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <input
            placeholder="Tìm theo tuyến, mã, xe, tài xế..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #d1d5db", width: 360 }}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: 8 }}>
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chưa khởi hành</option>
            <option value="on-trip">Đang chạy</option>
            <option value="completed">Đã hoàn thành</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: 8 }}>
            <option value="startAsc">Sắp xếp: giờ bắt đầu ↑</option>
            <option value="startDesc">Sắp xếp: giờ bắt đầu ↓</option>
          </select>
          <button
            style={{ ...btn, background: "#10b981", color: "#fff" }}
            onClick={() => exportCsv(filtered)}
            title="Xuất CSV các chuyến đang hiển thị"
          >
            Xuất CSV
          </button>
        </div>
      </div>

      {filtered.map((trip) => {
        const upcoming = isUpcoming(trip.startTime);
        const remainingStops = trip.stops.filter((s) => !s.visited).length;
        return (
          <div key={trip.id} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 600 }}>
                  {trip.route} <span style={{ color: "#374151", fontWeight: 500 }}>({trip.code})</span>
                </div>
                <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
                  🕓 {trip.startTime} → {trip.endTime} • 📍 {trip.stops.length} điểm • 👨‍🎓 {trip.students} học sinh • 🚐{" "}
                  {trip.distance}
                  {upcoming && <span style={{ marginLeft: 8, color: "#b45309" }}>● Sắp khởi hành</span>}
                </div>
                <div style={{ marginTop: 6, fontSize: 13, color: "#374151" }}>
                  ⏱️ ETA ước tính: <strong>{getEstimatedArrival(trip)}</strong> • Điểm còn lại: <strong>{remainingStops}</strong>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {trip.status === "pending" && (
                  <button style={{ ...btn, background: "#3b82f6", color: "#fff" }} onClick={() => startTrip(trip.id)}>
                    Bắt đầu
                  </button>
                )}
                {trip.status === "on-trip" && (
                  <button style={{ ...btn, background: "#ef4444", color: "#fff" }} onClick={() => completeTrip(trip.id)}>
                    Hoàn thành
                  </button>
                )}
                {trip.status === "completed" && (
                  <div style={{ color: "#16a34a", fontWeight: 600 }}>✅ Đã hoàn thành</div>
                )}
                <button style={{ ...btn, background: "#f3f4f6", color: "#111827" }} onClick={() => toggleDetails(trip.id)}>
                  {selected === trip.id ? "Ẩn chi tiết" : "Chi tiết"}
                </button>
              </div>
            </div>

            {selected === trip.id && (
              <div style={{ marginTop: 14, borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>📍 Danh sách điểm dừng</div>
                <ol style={{ marginLeft: 18, color: "#374151", fontSize: 14 }}>
                  {trip.stops.map((s, i) => (
                    <li key={i} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontWeight: 500 }}>{s.name}</div>
                        <div style={{ color: "#6b7280", fontSize: 13 }}>
                          🕒 {s.eta} • 👨‍🎓 {s.students} học sinh
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <label style={{ display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={!!s.visited}
                            onChange={() => toggleStopVisited(trip.id, i)}
                          />
                          <span style={{ fontSize: 13 }}>{s.visited ? "Đã qua" : "Chưa"}</span>
                        </label>
                        <button
                          style={{
                            padding: "6px 10px",
                            borderRadius: 8,
                            border: "1px solid #d1d5db",
                            background: "#fff",
                            cursor: "pointer",
                          }}
                          onClick={() => alert(`Mở chỉ đường đến: ${s.name}`)}
                        >
                          Bản đồ
                        </button>
                      </div>
                    </li>
                  ))}
                </ol>

                <div style={{ marginTop: 10, fontSize: 14, color: "#6b7280" }}>
                  🚐 Xe: <strong>{trip.vehicle}</strong> — Tài xế: <strong>{trip.driver}</strong>
                </div>

                <div style={{ marginTop: 8, fontSize: 14, color: "#374151", fontStyle: "italic" }}>📝 Ghi chú: {trip.notes}</div>

                <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                  <button
                    style={{ ...btn, background: "#f59e0b", color: "#fff" }}
                    onClick={() => alert("Đã gửi cảnh báo khẩn cấp!")}
                  >
                    ⚠️ Báo sự cố
                  </button>
                  <button
                    style={{ ...btn, background: "#fff", border: "1px solid #d1d5db", color: "#111827" }}
                    onClick={() => {
                      const note = prompt("Ghi chú mới cho chuyến:");
                      if (note) {
                        setTrips((prev) => prev.map((t) => (t.id === trip.id ? { ...t, notes: (t.notes || "") + "\n" + note } : t)));
                      }
                    }}
                  >
                    ➕ Thêm ghi chú
                  </button>
                  <button
                    style={{ ...btn, background: "#06b6d4", color: "#fff" }}
                    onClick={() => {
                      navigator.clipboard?.writeText(`${trip.route} (${trip.code}) - ${trip.startTime} - ${trip.vehicle}`) ;
                      alert("Thông tin chuyến đã được sao chép");
                    }}
                  >
                    Sao chép thông tin
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {filtered.length === 0 && <div style={{ color: "#6b7280" }}>Không có chuyến phù hợp.</div>}
    </div>
  );
}
