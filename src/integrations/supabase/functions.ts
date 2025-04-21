
import { supabase } from './client';

/**
 * Decrease the available seats for a ride
 */
export const decreaseAvailableSeats = async (
  rideId: string, 
  seatsToDecrease: number
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    if (!rideId) throw new Error('Ride ID is required');
    
    const { data, error } = await supabase.rpc(
      'decrease_available_seats',
      { 
        ride_id: rideId, 
        seats_to_decrease: seatsToDecrease 
      }
    );
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error decreasing available seats:', error);
    return { success: false, error: error as Error };
  }
};

/**
 * Increase the available seats for a ride
 */
export const increaseAvailableSeats = async (
  rideId: string, 
  seatsToIncrease: number
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    if (!rideId) throw new Error('Ride ID is required');
    
    const { data, error } = await supabase.rpc(
      'increase_available_seats',
      { 
        ride_id: rideId, 
        seats_to_increase: seatsToIncrease 
      }
    );
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error increasing available seats:', error);
    return { success: false, error: error as Error };
  }
};
