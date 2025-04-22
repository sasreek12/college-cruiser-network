import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRideLocation } from "@/hooks/useRideLocation";

interface RideLocationMapProps {
  rideId: string;
  hostId: string;
  initialLocation?: { lat: number; lng: number };
}

const RideLocationMap = ({
  rideId,
  hostId,
  initialLocation,
}: RideLocationMapProps) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isMapboxReady, setIsMapboxReady] = useState<boolean>(false);

  // For demo/preview only: you would use Supabase Auth for user ID in a real app
  const [userId, setUserId] = useState<string>(hostId);

  // Assume host if you are matching hostId, else rider
  const isHost = userId === hostId;

  // Get real-time location and eta for this ride
  const {
    location,
    etaSeconds,
    lastUpdated,
    updateMyLocation,
  } = useRideLocation({
    rideId,
    userId,
    isHost,
  });

  // Existing map logic, center on "location"
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !apiKey) return;
    mapboxgl.accessToken = apiKey;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: location
        ? [location.lng, location.lat]
        : [initialLocation?.lng || -74.006, initialLocation?.lat || 40.7128],
      zoom: 14,
    });

    marker.current = new mapboxgl.Marker()
      .setLngLat(
        location
          ? [location.lng, location.lat]
          : [initialLocation?.lng || -74.006, initialLocation?.lat || 40.7128]
      )
      .addTo(map.current);

    setIsMapboxReady(true);

    return () => {
      if (map.current) map.current.remove();
    };
    // eslint-disable-next-line
  }, [apiKey]);

  // On live location update: update marker and re-center
  useEffect(() => {
    if (!isMapboxReady || !location) return;
    if (marker.current && map.current) {
      marker.current.setLngLat([location.lng, location.lat]);
      map.current.setCenter([location.lng, location.lat]);
    }
  }, [location, isMapboxReady]);

  // For demo: allow host to "move" and update their location and ETA
  const [manualLat, setManualLat] = useState<string>("");
  const [manualLng, setManualLng] = useState<string>("");
  const [manualEta, setManualEta] = useState<string>("");

  const handleManualUpdate = () => {
    if (
      updateMyLocation &&
      manualLat &&
      manualLng
    ) {
      updateMyLocation(
        parseFloat(manualLat),
        parseFloat(manualLng),
        manualEta ? parseInt(manualEta) : undefined
      );
    }
  };

  // Helper to format ETA (seconds) as mm:ss countdown
  function formatCountdown(sec: number | null): string {
    if (sec == null || sec <= 0) return "Arrived";
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  // Countdown timer for ETA
  const [localEta, setLocalEta] = useState<number | null>(etaSeconds);
  useEffect(() => {
    setLocalEta(etaSeconds);
    if (etaSeconds == null) return;
    const interval = setInterval(() => {
      setLocalEta((old) =>
        old != null && old > 0 ? old - 1 : 0
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [etaSeconds]);

  return (
    <div className="relative w-full rounded-lg overflow-hidden">
      {!apiKey ? (
        <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
          <p className="text-sm mb-2">Please enter your Mapbox public token to display the map:</p>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter your Mapbox public token"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="text-xs"
            />
            <Button
              size="sm"
              onClick={() => setIsMapboxReady(false)}
              disabled={!apiKey}
            >
              Set Token
            </Button>
          </div>
          <p className="text-xs mt-2 text-gray-500">
            Find your token in the <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Mapbox dashboard</a> after creating an account
          </p>
        </div>
      ) : !isMapboxReady ? (
        <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
          <p className="text-sm">Loading map...</p>
        </div>
      ) : (
        <div className="h-[400px]">
          <div ref={mapContainer} className="absolute inset-0" />
          <div className="absolute left-0 bottom-0 bg-white bg-opacity-80 rounded-t-md px-3 py-2 m-2 shadow-lg">
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-xs">ETA:</span>
              <span className="font-bold text-lg">
                {localEta != null
                  ? formatCountdown(localEta)
                  : "–"}
              </span>
            </div>
            {lastUpdated && (
              <div className="text-xs text-gray-400">
                Last update: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
          {/* For hosts, show dev controls to move location/ETA */}
          {isHost && (
            <div className="absolute top-2 right-2 bg-white rounded-lg shadow px-4 py-2 space-y-1 text-xs">
              <div className="flex gap-1">
                <Input
                  placeholder="lat"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  className="w-20"
                />
                <Input
                  placeholder="lng"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  className="w-20"
                />
                <Input
                  placeholder="ETA (sec)"
                  value={manualEta}
                  onChange={(e) => setManualEta(e.target.value)}
                  className="w-20"
                />
                <Button size="sm" onClick={handleManualUpdate}>
                  Send Update
                </Button>
              </div>
              <div className="text-gray-400">Only visible to host (demo)</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RideLocationMap;
