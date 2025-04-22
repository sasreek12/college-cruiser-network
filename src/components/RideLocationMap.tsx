
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const [apiKey, setApiKey] = useState<string>('');
  const [isMapboxReady, setIsMapboxReady] = useState<boolean>(false);

  const initializeMap = () => {
    if (!mapContainer.current || !apiKey) return;

    mapboxgl.accessToken = apiKey;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [location.lng, location.lat],
        zoom: 14
      });

      marker.current = new mapboxgl.Marker()
        .setLngLat([location.lng, location.lat])
        .addTo(map.current);
      
      setIsMapboxReady(true);
    } catch (error) {
      console.error("Error initializing Mapbox:", error);
      setIsMapboxReady(false);
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !apiKey) return;
    
    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [apiKey]);

  useEffect(() => {
    if (!isMapboxReady) return;

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
      supabase.removeChannel(channel);
    };
  }, [rideId, hostId, isMapboxReady]);

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
              onClick={initializeMap}
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
        </div>
      )}
    </div>
  );
};

export default RideLocationMap;
