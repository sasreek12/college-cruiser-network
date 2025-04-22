
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';

interface RideLocationMapProps {
  rideId: string;
  hostId: string;
  initialLocation?: { lat: number; lng: number };
}

const RideLocationMap = ({ rideId, hostId, initialLocation }: RideLocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [location, setLocation] = useState(initialLocation || { lat: 40.7128, lng: -74.0060 });

  useEffect(() => {
    if (!mapContainer.current) return;

    // Please replace with your Mapbox public token
    mapboxgl.accessToken = 'YOUR-MAPBOX-PUBLIC-TOKEN';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [location.lng, location.lat],
      zoom: 14
    });

    marker.current = new mapboxgl.Marker()
      .setLngLat([location.lng, location.lat])
      .addTo(map.current);

    // Set up real-time location updates subscription
    const channel = supabase.channel('location-updates')
      .on(
        'broadcast',
        { event: `location:${rideId}` },
        ({ payload }) => {
          if (payload.hostId === hostId) {
            const newLocation = {
              lat: payload.latitude,
              lng: payload.longitude
            };
            
            setLocation(newLocation);
            
            if (marker.current && map.current) {
              marker.current.setLngLat([newLocation.lng, newLocation.lat]);
              map.current.setCenter([newLocation.lng, newLocation.lat]);
            }
          }
        }
      )
      .subscribe();

    return () => {
      if (map.current) {
        map.current.remove();
      }
      supabase.removeChannel(channel);
    };
  }, [rideId, hostId]);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default RideLocationMap;
