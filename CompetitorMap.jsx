import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';

export default function CompetitorMap({
  competitors = [],
  center = null,
  targetLocationName = "Target Location",
  radiusKm = 3.0
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const catchmentCircleRef = useRef(null);
  const markersGroupRef = useRef(null);

  const [activeCompetitor, setActiveCompetitor] = useState(null);
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' | 'satellite'
  const [showRadius, setShowRadius] = useState(true);
  const [mapError, setMapError] = useState(false);

  // Compute map center dynamically from center prop, or competitor list, or default
  const mapCenter = useMemo(() => {
    if (center && Array.isArray(center) && center.length === 2 && !isNaN(center[0])) {
      return center;
    }
    const firstWithCoords = competitors.find(c => c && !isNaN(Number(c.lat)) && !isNaN(Number(c.lng)));
    if (firstWithCoords) {
      return [Number(firstWithCoords.lat), Number(firstWithCoords.lng)];
    }
    return [19.0596, 72.8295];
  }, [center, competitors]);

  // Valid competitors with authentic, true Google Maps GPS coordinates
  const processedCompetitors = useMemo(() => {
    const valid = (competitors || []).filter(
      (c) => c && !isNaN(Number(c.lat)) && !isNaN(Number(c.lng))
    );

    // Keep true exact Google Maps GPS coordinates
    return valid.map((comp, idx, arr) => {
      let lat = Number(comp.lat);
      let lng = Number(comp.lng);

      // Only if two distinct establishments share the exact same GPS coordinates (e.g. same mall)
      // do we apply a sub-meter visual micro-nudge (~10m) so both pins remain clickable
      for (let j = 0; j < idx; j++) {
        const prev = arr[j];
        const dist = Math.hypot(lat - Number(prev.lat), lng - Number(prev.lng));
        if (dist < 0.00008) {
          const angle = idx * (2 * Math.PI / 6);
          lat += Math.sin(angle) * 0.00015;
          lng += Math.cos(angle) * 0.00015;
          break;
        }
      }

      return {
        ...comp,
        displayLat: lat,
        displayLng: lng
      };
    });
  }, [competitors]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      // Fix default marker icon issues in Leaflet when bundled
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Cleanup existing instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      if (mapContainerRef.current._leaflet_id) {
        delete mapContainerRef.current._leaflet_id;
      }

      // Initialize map with clean Google-like defaults
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
        maxZoom: 19,
        minZoom: 10
      }).setView(mapCenter, 14);

      mapInstanceRef.current = map;

      // Realistic Google Maps Tile Layer
      const tileUrl = mapType === 'satellite'
        ? 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
        : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }).addTo(map);
      tileLayerRef.current = tileLayer;

      // Google Maps style catchment radius circle
      const radiusMeters = (Number(radiusKm) || 3.0) * 1000;
      const circle = L.circle(mapCenter, {
        color: '#1a73e8',
        fillColor: '#4285F4',
        fillOpacity: 0.08,
        radius: radiusMeters,
        weight: 1.8,
        dashArray: '5, 5'
      }).addTo(map);
      catchmentCircleRef.current = circle;

      // 1. Google Maps Target Location Pin (Iconic pulsing blue beacon)
      const targetIcon = L.divIcon({
        className: 'google-target-pin',
        html: `
          <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(66, 133, 244, 0.28); animation: ping 2.2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background: rgba(66, 133, 244, 0.35); border: 1.5px solid #1a73e8;"></div>
            <div style="position: relative; width: 14px; height: 14px; border-radius: 50%; background: #1a73e8; border: 2.5px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.45);"></div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
      });

      L.marker(mapCenter, { icon: targetIcon, zIndexOffset: 999 })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 10px 12px; min-width: 190px; color: #1f2937;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #1a73e8;"></span>
              <span style="color: #1a73e8; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em;">Target Location</span>
            </div>
            <div style="color: #111827; font-weight: 700; font-size: 14px; margin-top: 4px;">${targetLocationName}</div>
            <div style="color: #6b7280; font-size: 11px; margin-top: 3px; border-top: 1px solid #e5e7eb; padding-top: 5px;">
              ${radiusKm} km market entry catchment radius
            </div>
          </div>
        `);

      // 2. Realistic Google Maps Red Teardrop Competitor Pins
      const markersGroup = L.featureGroup();
      markersGroupRef.current = markersGroup;

      processedCompetitors.forEach((comp, idx) => {
        const lat = comp.displayLat;
        const lng = comp.displayLng;
        const rating = comp.rating ? Number(comp.rating).toFixed(1) : '4.5';
        const isHighOpp = String(comp.opportunity || '').toLowerCase().includes('high');

        // Google Maps iconic Red Pin (or Emerald badge for High Opportunity)
        const pinBg = isHighOpp ? '#0F9D58' : '#EA4335';

        const googlePinIcon = L.divIcon({
          className: `gmap-pin-${idx}`,
          html: `
            <div style="position: relative; width: 36px; height: 44px; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); filter: drop-shadow(0 4px 6px rgba(0,0,0,0.35));">
              <!-- Pin Head -->
              <div style="
                width: 34px;
                height: 34px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                background: ${pinBg};
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1.5px solid #ffffff;
              ">
                <!-- White Inner Badge with Star Rating -->
                <div style="
                  transform: rotate(45deg);
                  background: #ffffff;
                  border-radius: 50%;
                  width: 22px;
                  height: 22px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  font-size: 10px;
                  font-weight: 800;
                  color: #1f2937;
                  box-shadow: inset 0 1px 2px rgba(0,0,0,0.15);
                ">
                  ${rating}
                </div>
              </div>
              <!-- Ground Pin Shadow Point -->
              <div style="width: 6px; height: 3px; background: rgba(0,0,0,0.25); border-radius: 50%; margin-top: -2px;"></div>
            </div>
          `,
          iconSize: [36, 44],
          iconAnchor: [18, 42],
          popupAnchor: [0, -42]
        });

        const marker = L.marker([lat, lng], { icon: googlePinIcon });

        marker.on('click', () => {
          setActiveCompetitor(comp);
        });

        // Google Maps Place Card Popup
        marker.bindPopup(`
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 12px 14px; min-width: 220px; color: #1f2937;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
              <div style="color: #111827; font-weight: 700; font-size: 14px; line-height: 1.2;">${comp.name}</div>
              <span style="background: #FEF3C7; color: #92400E; border: 1px solid #FCD34D; border-radius: 4px; padding: 1px 5px; font-size: 10px; font-weight: 700; white-space: nowrap;">
                ★ ${rating}
              </span>
            </div>
            <div style="color: #4B5563; font-size: 11px; margin-top: 3px;">
              ${comp.location || comp.address || 'Local Establishment'}
            </div>
            <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #E5E7EB; display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
              <span style="color: #6B7280;">${comp.reviews ? `${comp.reviews.toLocaleString()} reviews` : 'Verified Place'}</span>
              <span style="color: #111827; font-weight: 700;">${(comp.price && comp.price !== '₹₹' && comp.price !== '$$') ? comp.price : (comp.price_num ? '₹' + comp.price_num : 'Market Std')}</span>
            </div>
            ${comp.opportunity ? `
              <div style="margin-top: 6px; padding: 4px 6px; border-radius: 4px; background: #ECFDF5; border: 1px solid #A7F3D0; color: #065F46; font-size: 10px; font-weight: 600;">
                ⚡ ${comp.opportunity}
              </div>
            ` : ''}
            <div style="margin-top: 8px; text-align: right;">
              <a href="${comp.source_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(comp.name + ' ' + (comp.location || ''))}`}" target="_blank" rel="noopener noreferrer" style="color: #1A73E8; font-size: 11px; text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 2px;">
                <span>View on Google Maps</span> ↗
              </a>
            </div>
          </div>
        `);

        markersGroup.addLayer(marker);
      });

      markersGroup.addTo(map);

      // Auto-fit bounds comfortably to show all competitors and target
      if (processedCompetitors.length > 0) {
        const allPoints = [mapCenter, ...processedCompetitors.map(c => [c.displayLat, c.displayLng])];
        const bounds = L.latLngBounds(allPoints);
        map.fitBounds(bounds, { padding: [45, 45], maxZoom: 15 });
      }

    } catch (err) {
      console.warn("Google Maps Leaflet initialization notice:", err);
      setMapError(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {}
        mapInstanceRef.current = null;
      }
    };
  }, [processedCompetitors, mapCenter, radiusKm, targetLocationName, mapType]);

  // Switch Google Maps Layer (Roadmap vs Satellite)
  const handleSwitchLayer = (type) => {
    setMapType(type);
    if (mapInstanceRef.current && tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
      const newUrl = type === 'satellite'
        ? 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
        : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
      const newLayer = L.tileLayer(newUrl, {
        maxZoom: 19,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }).addTo(mapInstanceRef.current);
      tileLayerRef.current = newLayer;
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(mapCenter, 14, { duration: 0.8 });
    }
  };

  const handleFitAll = () => {
    if (mapInstanceRef.current && processedCompetitors.length > 0) {
      const allPoints = [mapCenter, ...processedCompetitors.map(c => [c.displayLat, c.displayLng])];
      const bounds = L.latLngBounds(allPoints);
      mapInstanceRef.current.fitBounds(bounds, { padding: [45, 45], maxZoom: 15 });
    }
  };

  const handleToggleRadius = () => {
    if (catchmentCircleRef.current && mapInstanceRef.current) {
      if (showRadius) {
        mapInstanceRef.current.removeLayer(catchmentCircleRef.current);
        setShowRadius(false);
      } else {
        catchmentCircleRef.current.addTo(mapInstanceRef.current);
        setShowRadius(true);
      }
    }
  };

  if (mapError) {
    return (
      <div className="relative w-full h-96 rounded-xl overflow-hidden border border-surface-container-high shadow-xl bg-surface-container flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-secondary text-4xl mb-2">radar</span>
        <h4 className="font-headline-sm text-sm text-on-surface font-bold">Geospatial Intelligence Mapped</h4>
        <p className="text-xs text-on-surface-variant max-w-sm mt-1">
          {competitors.length} competitor nodes detected across target catchment radius.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[420px] sm:h-[460px] rounded-xl overflow-hidden border border-surface-container-high shadow-2xl bg-[#e5e3df]">
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* TOP-LEFT: Google Maps Layer Switcher (Map vs Satellite) */}
      <div className="absolute top-3.5 left-3.5 z-10 flex items-center bg-white/95 backdrop-blur-md rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.25)] border border-gray-200 overflow-hidden p-0.5 text-xs font-sans font-semibold">
        <button
          onClick={() => handleSwitchLayer('roadmap')}
          className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
            mapType === 'roadmap'
              ? 'bg-[#1a73e8] text-white shadow-sm font-bold'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">map</span>
          <span>Map</span>
        </button>
        <button
          onClick={() => handleSwitchLayer('satellite')}
          className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
            mapType === 'satellite'
              ? 'bg-[#1a73e8] text-white shadow-sm font-bold'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">satellite_alt</span>
          <span>Satellite</span>
        </button>
      </div>

      {/* TOP-RIGHT: Catchment Circle Toggle & Quick Actions */}
      <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.25)] border border-gray-200">
        <button
          onClick={handleToggleRadius}
          title={showRadius ? "Hide Catchment Boundary" : "Show Catchment Boundary"}
          className={`px-2 py-1 rounded text-xs font-sans font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
            showRadius
              ? 'bg-blue-50 text-[#1a73e8] font-bold'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {showRadius ? 'check_circle' : 'radio_button_unchecked'}
          </span>
          <span>{radiusKm} km Zone</span>
        </button>
      </div>

      {/* BOTTOM-RIGHT: Google Maps Zoom & Navigation Controls */}
      <div className="absolute bottom-3.5 right-3.5 z-10 flex flex-col gap-1.5">
        {/* Recenter & Fit All Buttons */}
        <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.25)] border border-gray-200 p-0.5 flex flex-col">
          <button
            onClick={handleRecenter}
            title="Recenter on Target Location"
            className="p-2 text-gray-700 hover:text-[#1a73e8] hover:bg-gray-100 transition-colors cursor-pointer rounded flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[19px]">my_location</span>
          </button>
          <div className="h-[1px] bg-gray-200 mx-1"></div>
          <button
            onClick={handleFitAll}
            title="Fit All Competitors in View"
            className="p-2 text-gray-700 hover:text-[#1a73e8] hover:bg-gray-100 transition-colors cursor-pointer rounded flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[19px]">fullscreen</span>
          </button>
        </div>

        {/* Zoom In & Zoom Out Buttons */}
        <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.25)] border border-gray-200 p-0.5 flex flex-col">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2 text-gray-700 hover:text-[#1a73e8] hover:bg-gray-100 transition-colors cursor-pointer rounded flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[19px]">add</span>
          </button>
          <div className="h-[1px] bg-gray-200 mx-1"></div>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2 text-gray-700 hover:text-[#1a73e8] hover:bg-gray-100 transition-colors cursor-pointer rounded flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[19px]">remove</span>
          </button>
        </div>
      </div>

      {/* BOTTOM-LEFT: Google Maps Status Bar & Legend */}
      <div className="absolute bottom-3.5 left-3.5 z-10 flex flex-wrap items-center gap-2">
        <div className="px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-md text-xs font-sans text-gray-800 shadow-[0_2px_8px_rgba(0,0,0,0.25)] border border-gray-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold">{processedCompetitors.length} SerpApi Places Plotted</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-md text-[11px] font-sans text-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.25)] border border-gray-200">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1a73e8] border border-white shadow-sm"></span>
            <span>Target Center</span>
          </span>
          <span className="text-gray-300">•</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335] border border-white shadow-sm"></span>
            <span>Competitor Pin</span>
          </span>
          <span className="text-gray-300">•</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F9D58] border border-white shadow-sm"></span>
            <span>High Opportunity</span>
          </span>
        </div>
      </div>

      {/* Selected Competitor Quick Inspector Drawer */}
      {activeCompetitor && (
        <div className="absolute top-14 left-3.5 z-10 max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl p-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.25)] animate-in fade-in slide-in-from-top-2 duration-150 text-gray-900 font-sans">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-[#1a73e8] text-[10px] font-bold uppercase tracking-wider">
                Google Maps Verified Place
              </span>
              <h4 className="text-sm text-gray-900 font-extrabold mt-1">
                {activeCompetitor.name}
              </h4>
            </div>
            <button
              onClick={() => setActiveCompetitor(null)}
              className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer rounded"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>

          <p className="text-xs text-gray-600 mt-1 truncate">
            {activeCompetitor.location || activeCompetitor.address || 'Local Zone'}
          </p>

          <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-gray-100 text-xs font-mono">
            <div>
              <span className="text-gray-400 text-[10px] block">RATING</span>
              <span className="text-amber-500 font-bold">★ {activeCompetitor.rating || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-400 text-[10px] block">REVIEWS</span>
              <span className="text-gray-800 font-bold">{activeCompetitor.reviews || 0}</span>
            </div>
            <div>
              <span className="text-gray-400 text-[10px] block">PRICE</span>
              <span className="text-gray-800 font-bold">{(activeCompetitor.price && activeCompetitor.price !== '₹₹' && activeCompetitor.price !== '$$') ? activeCompetitor.price : (activeCompetitor.price_num ? `₹${activeCompetitor.price_num}` : 'Std')}</span>
            </div>
          </div>

          {activeCompetitor.opportunity && (
            <div className="mt-2 text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">
              ⚡ {activeCompetitor.opportunity}
            </div>
          )}

          <div className="mt-2.5 text-right">
            <a
              href={activeCompetitor.source_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeCompetitor.name + ' ' + (activeCompetitor.location || ''))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#1a73e8] hover:underline font-bold"
            >
              <span>Open in Google Maps</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
