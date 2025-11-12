import React, { useEffect, useMemo, useState } from "react";

/**
 * Helper: ánh xạ trạng thái sang màu/nhãn
 */
const STATUS_MAP = {
  "Đang đón": { label: "Đang đón học sinh", color: "bg-amber-100 text-amber-800 border-amber-300" },
  "Đã đón": { label: "Đã đón học sinh", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  "Đang di chuyển": { label: "Xe đang di chuyển", color: "bg-sky-100 text-sky-800 border-sky-300" },
};

const STEPS = ["Đang đón", "Đã đón", "Đang di chuyển"];

const ParentTracking = () => {
  const [student, setStudent] = useState({
    name: "Nguyễn Văn An",
    pickupTime: "10:41",
    dropoffTime: "17:00",
    busNumber: "BS-001",
    status: "Đang đón", // "Đang đón" | "Đã đón" | "Đang di chuyển"
  });

  const [bus, setBus] = useState({
    route: {
      from: "Điểm dừng 2 - Dương Nguyễn Huệ",
      to: "Điểm dừng 3 - Chợ Biên Thành",
    },
    currentStatus: "Đang di chuyển",
    eta: "07:51",
  });

  const [loading, setLoading] = useState(true);

  // Giả lập tải dữ liệu và cập nhật trạng thái
  useEffect(() => {
    const loadTimer = setTimeout(() => setLoading(false), 800); // skeleton loading
    const updateTimer = setTimeout(() => {
      setStudent((prev) => ({ ...prev, status: "Đã đón" }));
    }, 5000);
    return () => {
      clearTimeout(loadTimer);
      clearTimeout(updateTimer);
    };
  }, []);

  const currentStepIndex = useMemo(
    () => STEPS.findIndex((s) => s === student.status),
    [student.status]
  );

  return (
    <div className="min-h-screen rounded-xl">
      {/* Content */}
      <main className=" mx-auto ">
        {/* Grid: Student card + Bus tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Card */}
          <section className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Thông tin học sinh</h2>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-medium ${
                    STATUS_MAP[student.status]?.color
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                  {STATUS_MAP[student.status]?.label}
                </span>
              </div>

              {loading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-5 bg-gray-100 rounded" />
                  <div className="h-5 bg-gray-100 rounded w-2/3" />
                  <div className="h-5 bg-gray-100 rounded w-1/2" />
                  <div className="h-5 bg-gray-100 rounded w-1/3" />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tên</span>
                    <span className="text-sm font-medium text-gray-900">{student.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Giờ đón</span>
                    <span className="text-sm font-medium text-gray-900">{student.pickupTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Giờ trả</span>
                    <span className="text-sm font-medium text-gray-900">{student.dropoffTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Xe số</span>
                    <span className="text-sm font-medium text-gray-900">{student.busNumber}</span>
                  </div>
                </div>
              )}

              {/* Progress steps */}
              <div className="mt-5">
                <p className="text-sm font-medium text-gray-900 mb-2">Trạng thái hành trình</p>
                <div className="flex items-center gap-3">
                  {STEPS.map((step, idx) => {
                    const active = idx <= currentStepIndex;
                    return (
                      <div key={step} className="flex items-center">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                            active ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"
                          }`}
                          aria-label={step}
                        >
                          {idx + 1}
                        </div>
                        {idx < STEPS.length - 1 && (
                          <div
                            className={`mx-2 h-0.5 w-10 ${
                              idx < currentStepIndex ? "bg-indigo-600" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  {student.status === "Đang đón"
                    ? "Tài xế đang trên đường đến điểm đón."
                    : student.status === "Đã đón"
                    ? "Học sinh đã lên xe, chuẩn bị di chuyển."
                    : "Xe đang trên lộ trình đến điểm trả."}
                </div>
              </div>
            </div>
          </section>

          {/* Bus tracking */}
          <section className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Theo dõi xe {student.busNumber}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Tuyến: {bus.route.from} → {bus.route.to}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs">
                    Trạng thái: {bus.currentStatus}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs">
                    ETA: {bus.eta}
                  </span>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="p-5">
                <div className="rounded-lg border border-dashed border-gray-300 h-56 lg:h-64 bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-900 font-medium mb-1">Bản đồ hành trình</div>
                    <div className="text-sm text-gray-600">
                      Tích hợp Google Maps/Leaflet để hiển thị vị trí xe theo thời gian thực.
                    </div>
                  </div>
                </div>

                {/* Timeline route */}
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-900 mb-3">Lộ trình</p>
                  <ol className="relative border-l border-gray-200 pl-4 space-y-6">
                    <li>
                      <div className="absolute -left-1.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">Điểm xuất phát</span>
                          <span className="block text-gray-600">{bus.route.from}</span>
                        </div>
                        <span className="text-xs text-gray-500">Giờ dự kiến: {student.pickupTime}</span>
                      </div>
                    </li>
                    <li>
                      <div className="absolute -left-1.5 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white" />
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">Đích đến</span>
                          <span className="block text-gray-600">{bus.route.to}</span>
                        </div>
                        <span className="text-xs text-gray-500">Giờ dự kiến: {student.dropoffTime}</span>
                      </div>
                    </li>
                  </ol>
                </div>

                {/* Action bar */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={() =>
                      setBus((prev) => ({
                        ...prev,
                        currentStatus: "Đang di chuyển",
                        eta: "07:45",
                      }))
                    }
                  >
                    Cập nhật nhanh
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white text-gray-700 border border-gray-300 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    onClick={() => setStudent((prev) => ({ ...prev, status: "Đang di chuyển" }))}
                  >
                    Đánh dấu “Đang di chuyển”
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17l5-5m0 0l-5-5m5 5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center text-xs text-gray-500">
          Cập nhật: 05/11/2023 · Dữ liệu giả lập cho mục đích demo giao diện
        </div>
      </main>
    </div>
  );
};

export default ParentTracking;