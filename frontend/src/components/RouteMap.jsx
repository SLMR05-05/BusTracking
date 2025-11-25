import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function RouteMap({ stops = [], currentPosition = null }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routingControlRef = useRef(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([10.762622, 106.660172], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers and routes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers and routing control
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];
    
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

    if (stops.length === 0) return;

    const bounds = [];
    const waypoints = [];

    // Add station markers and collect waypoints
    stops.forEach((stop, index) => {
      const lat = parseFloat(stop.lat);
      const lng = parseFloat(stop.lng);
      
      if (isNaN(lat) || isNaN(lng)) return;

      bounds.push([lat, lng]);
      waypoints.push(L.latLng(lat, lng));

      const isPassed = stop.status === 'completed';
      const isCurrent = stop.status === 'arrived';
      
      // Custom icon
      const iconColor = isPassed ? '#22c55e' : isCurrent ? '#eab308' : '#3b82f6';
      const icon = L.divIcon({
        className: 'custom-station-marker',
        html: `<div style="
          background-color: ${iconColor}; 
          width: 36px; 
          height: 36px; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: white; 
          font-weight: bold; 
          border: 3px solid white; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.3); 
          font-size: 16px;
        ">${stop.order || index + 1}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker([lat, lng], { icon })
        .bindPopup(`
          <div style="min-width: 150px;">
            <b>${stop.name}</b><br/>
            <small>${stop.address || ''}</small><br/>
            <span style="color: ${iconColor}; font-weight: bold;">
              ${isPassed ? '✓ Đã qua' : isCurrent ? '● Đang ở đây' : '○ Chưa đến'}
            </span>
          </div>
        `)
        .addTo(map);

      markersRef.current.push(marker);
    });

    // Draw real route using OSRM routing
    if (waypoints.length >= 2) {
      const routingControl = L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        lineOptions: {
          styles: [
            { color: '#3b82f6', opacity: 0.8, weight: 6 }
          ],
          extendToWaypoints: true,
          missingRouteTolerance: 0
        },
        createMarker: function() { return null; }, // Hide default markers
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1'
        })
      }).addTo(map);

      // Hide the routing instructions panel
      const container = routingControl.getContainer();
      if (container) {
        container.style.display = 'none';
      }

      routingControlRef.current = routingControl;
    }

    // Add current position marker if available
    if (currentPosition) {
      const { lat, lng } = currentPosition;
      if (!isNaN(lat) && !isNaN(lng)) {
        bounds.push([lat, lng]);

        const busIcon = L.divIcon({
          className: 'custom-bus-marker',
          html: `<div style="
            background-color: #ef4444; 
            width: 40px; 
            height: 40px; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: white; 
            font-weight: bold; 
            border: 4px solid white; 
            box-shadow: 0 4px 12px rgba(239,68,68,0.5); 
            font-size: 20px;
            animation: pulse 2s infinite;
          "></div>
          <style>
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
            }
          </style>`,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        const busMarker = L.marker([lat, lng], { icon })
          .bindPopup('<b>Vị trí xe hiện tại</b>')
          .addTo(map);

        markersRef.current.push(busMarker);
      }
    }

    // Fit bounds to show all markers
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [stops, currentPosition]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    />
  );
}
