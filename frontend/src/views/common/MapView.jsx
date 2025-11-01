import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapView({
  center = [10.762622, 106.660172], 
  zoom = 15,
  markers = [],
  role = "guest",
}) {
  useEffect(() => {
    console.log(`Map loaded for role: ${role}`);
  }, [role]);

  return (
    <div style={{ width: "100%", height: "85vh", borderRadius: "12px", overflow: "hidden" }}>
      <MapContainer center={center} zoom={zoom} style={{ width: "100%", height: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m, i) => (
          <Marker key={i} position={m.position}>
            <Popup>
              <b>{m.label || "Điểm"}</b><br />
              {role === "driver" && "Xe đang di chuyển"}
              {role === "parent" && "Vị trí xe con bạn"}
              {role === "admin" && "Theo dõi toàn hệ thống"}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
