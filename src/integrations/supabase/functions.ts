
import { supabase } from './client';

/**
 * Decrease the available seats for a ride
 * Note: This is the TypeScript equivalent for the Supabase RPC function
 * that must be created on the database
 */
export const decreaseAvailableSeats = async (
  rideId: string, 
  seatsToDecrease: number
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { data, error } = await supabase.rpc(
      'decrease_available_seats',
      { ride_id: rideId, seats_to_decrease: seatsToDecrease }
    );
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error decreasing available seats:', error);
    return { success: false, error: error as Error };
  }
};
