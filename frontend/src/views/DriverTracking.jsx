import React, { useEffect, useState } from "react";

export default function DriverTracking() {
  const [busPosition, setBusPosition] = useState({ lat: 10.776, lng: 106.7 });
  const [studentsOnBus, setStudentsOnBus] = useState(25);
  const [eta, setEta] = useState("07:05");
  const [routeInfo] = useState({
    routeCode: "BS-001",
    routeName: "Tuyến 1 - Quận 1",
    currentStop: "Điểm dừng 2 - Đường Nguyễn Huệ",
    nextStop: "Điểm dừng 3 - Chợ Bến Thành",
  });

  // Mock live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBusPosition((prev) => ({
        lat: +(prev.lat + (Math.random() - 0.5) * 0.001).toFixed(6),
        lng: +(prev.lng + (Math.random() - 0.5) * 0.001).toFixed(6),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Build OpenStreetMap embed URL around current position
  const getOsmEmbedUrl = (lat, lng, zoom = 15) => {
    const delta = 0.01; // small bbox to center the map
    const left = lng - delta;
    const bottom = lat - delta;
    const right = lng + delta;
    const top = lat + delta;
    // export/embed.html supports bbox and marker parameters
    return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}#map=${zoom}/${lat}/${lng}`;
  };

  const mapSrc = getOsmEmbedUrl(busPosition.lat, busPosition.lng);

  return (
    <div className="p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">🚍 Theo dõi xe</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 border rounded-2xl overflow-hidden shadow-sm">
          <div className="w-full h-[450px] bg-gray-100">
            {/* simple embed map, no external react-leaflet or icon libs */}
            <iframe
              title="map"
              src={mapSrc}
              key={`${busPosition.lat}-${busPosition.lng}`} // force iframe reload when coords change
              className="w-full h-full border-0"
            />
          </div>
          <div className="p-3 border-t bg-white">
            <strong>Vị trí hiện tại:</strong>{" "}
            {busPosition.lat.toFixed(6)}, {busPosition.lng.toFixed(6)}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="border rounded p-4 bg-white shadow-sm">
            <div className="text-blue-600 font-semibold flex items-center gap-2">
              <span>🚍</span>
              <span>{routeInfo.routeCode}</span>
            </div>
            <div className="text-gray-600">{routeInfo.routeName}</div>

            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-600">📍</span>
                <span>Hiện tại: {routeInfo.currentStop}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-600">📍</span>
                <span>Tiếp theo: {routeInfo.nextStop}</span>
              </div>
            </div>
          </div>

          <div className="border rounded p-4 bg-white shadow-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <span>👥</span>
              <span>Học sinh trên xe: {studentsOnBus}</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-gray-700">
              <span></span>
              <span>Dự kiến đến: {eta}</span>
            </div>
          </div>

          <div className="border rounded p-4 bg-white shadow-sm flex flex-col gap-2">
            <button
              type="button"
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
              onClick={() => alert("Gửi cảnh báo khẩn cấp")}
            >
               Gửi cảnh báo khẩn cấp
            </button>
            <button
              type="button"
              className="w-full border py-2 rounded hover:bg-gray-50"
              onClick={() => alert("Báo cáo sự cố")}
            >
              ⚠️ Báo cáo sự cố
            </button>
            <button
              type="button"
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              onClick={() => alert("Hoàn thành chuyến đi")}
            >
              ✅ Hoàn thành chuyến đi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
