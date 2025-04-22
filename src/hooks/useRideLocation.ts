
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Handles:
 * - Submitting host location and ETA to Supabase
 * - Subscribing to real-time ride location/ETA for host or rider
 * Returns both location data and function to update own location (for hosts)
 */
export function useRideLocation({
  rideId,
  userId,
  isHost
}: {
  rideId: string;
  userId: string;
  isHost?: boolean; // true for host/driver, false for rider/client
}) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [etaSeconds, setEtaSeconds] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Listen for changes to this ride's host location/ETA
  useEffect(() => {
    if (!rideId) return;

    const channel = supabase
      .channel("public:ride_locations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ride_locations",
          filter: `ride_id=eq.${rideId}`,
        },
        (payload) => {
          if (payload.new) {
            setLocation({
              lat: Number(payload.new.latitude),
              lng: Number(payload.new.longitude)
            });
            setEtaSeconds(payload.new.eta_seconds ?? null);
            setLastUpdated(new Date(payload.new.updated_at));
          }
        }
      )
      .subscribe();

    // Load latest location right away
    (async () => {
      const { data, error } = await supabase
        .from("ride_locations")
        .select("*")
        .eq("ride_id", rideId)
        .order("updated_at", { ascending: false })
        .limit(1);
      if (data && data.length > 0) {
        setLocation({
          lat: Number(data[0].latitude),
          lng: Number(data[0].longitude)
        });
        setEtaSeconds(data[0].eta_seconds ?? null);
        setLastUpdated(new Date(data[0].updated_at));
      }
    })();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [rideId]);

  // Hosts can update their own location and ETA
  const updateMyLocation = useCallback(
    async (lat: number, lng: number, eta?: number) => {
      if (!userId || !rideId) return;
      // Upsert (insert or update) location
      await supabase
        .from("ride_locations")
        .upsert(
          [
            {
              ride_id: rideId,
              user_id: userId,
              latitude: lat,
              longitude: lng,
              eta_seconds: eta ?? null,
              updated_at: new Date().toISOString(),
            },
          ],
          { onConflict: "ride_id,user_id" }
        );
    },
    [rideId, userId]
  );

  // Only provide the setter to the host
  return {
    location,
    etaSeconds,
    lastUpdated,
    updateMyLocation: isHost ? updateMyLocation : undefined,
  };
}
