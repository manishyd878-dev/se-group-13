import { useEffect, useRef } from 'react';
import { Navigation, Phone, MapPin, ExternalLink } from 'lucide-react';

export default function HospitalMap({ hospitals = [], userLocation = null, highlightGroup = null }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check if Leaflet is loaded
    const L = window.L;
    if (!L) return;

    // Center coordinates
    const defaultCenter = userLocation
      ? [userLocation.lat, userLocation.lng]
      : hospitals.length > 0 && hospitals[0]?.location?.coordinates?.[1]
      ? [hospitals[0].location.coordinates[1], hospitals[0].location.coordinates[0]]
      : [19.076, 72.8777]; // Default Mumbai center

    // Initialize map if not created
    if (!mapRef.current) {
      const map = L.map(containerRef.current).setView(defaultCenter, userLocation ? 12 : 11);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      mapRef.current = map;
    } else {
      mapRef.current.setView(defaultCenter, userLocation ? 12 : mapRef.current.getZoom());
    }

    const map = mapRef.current;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add User Location Marker if available
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `<div style="background-color: #2563eb; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(37,99,235,0.6);"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <strong style="color: #2563eb;">📍 Your Current Location</strong>
            <p style="margin: 4px 0 0; font-size: 11px; color: #64748b;">${userLocation.addressName || 'GPS Location detected'}</p>
          </div>
        `);
      markersRef.current.push(userMarker);
    }

    // Add Hospital Markers
    const bounds = L.latLngBounds();
    if (userLocation) {
      bounds.extend([userLocation.lat, userLocation.lng]);
    }

    hospitals.forEach((h, index) => {
      let lat, lng;
      if (h.location?.coordinates && (h.location.coordinates[0] !== 0 || h.location.coordinates[1] !== 0)) {
        lng = h.location.coordinates[0];
        lat = h.location.coordinates[1];
      } else {
        // Fallback layout offset if no precise GPS coordinates set
        const baseLat = userLocation ? userLocation.lat : 19.076;
        const baseLng = userLocation ? userLocation.lng : 72.8777;
        const angle = (index / Math.max(1, hospitals.length)) * 2 * Math.PI;
        const radius = 0.02 * (1 + (index % 3) * 0.5);
        lat = baseLat + Math.sin(angle) * radius;
        lng = baseLng + Math.cos(angle) * radius;
      }

      bounds.extend([lat, lng]);

      const stockCount = highlightGroup && h.stock ? (h.stock[highlightGroup] || 0) : null;
      const isAvailable = stockCount === null || stockCount > 0;

      const hospitalIcon = L.divIcon({
        className: 'custom-hospital-marker',
        html: `
          <div style="
            background-color: ${isAvailable ? '#dc2626' : '#94a3b8'};
            color: white;
            padding: 4px 8px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            font-family: sans-serif;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(220,38,38,0.3);
            border: 2px solid white;
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <span>🏥 ${h.name.length > 14 ? h.name.slice(0, 14) + '...' : h.name}</span>
            ${stockCount !== null ? `<span style="background: rgba(255,255,255,0.3); padding: 1px 5px; border-radius: 10px;">${stockCount}</span>` : ''}
          </div>
        `,
        iconAnchor: [40, 15],
      });

      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(h.name)}`;
      const distanceText = h.distanceKm !== undefined && h.distanceKm !== null ? `${h.distanceKm.toFixed(1)} km away` : (h.distance || 'Nearby');

      const marker = L.marker([lat, lng], { icon: hospitalIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: sans-serif; min-width: 200px; padding: 4px;">
            <h4 style="margin: 0; font-size: 14px; font-weight: 700; color: #1c1417;">${h.name}</h4>
            <p style="margin: 4px 0; font-size: 12px; color: #64748b;">📍 ${h.address || 'Address available'}</p>
            <p style="margin: 4px 0; font-size: 11px; color: #dc2626; font-weight: 600;">🚗 ${distanceText}</p>
            ${highlightGroup ? `<div style="margin: 8px 0; background: #fef2f2; padding: 6px; border-radius: 8px; font-size: 12px; color: #b91c1c;"><strong>${highlightGroup}:</strong> ${stockCount || 0} units</div>` : ''}
            <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" style="
              display: inline-block;
              margin-top: 8px;
              width: 100%;
              text-align: center;
              background-color: #dc2626;
              color: white;
              padding: 6px 12px;
              border-radius: 16px;
              font-size: 11px;
              font-weight: 600;
              text-decoration: none;
              box-sizing: border-box;
            ">
              🗺️ Open Google Maps Directions
            </a>
          </div>
        `);

      markersRef.current.push(marker);
    });

    if (hospitals.length > 0 && mapRef.current) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }

  }, [hospitals, userLocation, highlightGroup]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-sm">
      <div ref={containerRef} className="h-[480px] w-full z-0" />
    </div>
  );
}
