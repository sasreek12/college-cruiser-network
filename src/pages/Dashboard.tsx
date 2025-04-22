import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from '@/components/Navbar';
import RideCard, { RideCardProps } from '@/components/RideCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { increaseAvailableSeats } from '@/integrations/supabase/functions';

const Dashboard = () => {
  const { toast } = useToast();
  const [upcomingHostedRides, setUpcomingHostedRides] = useState<Omit<RideCardProps, 'onBook' | 'onCancel'>[]>([]);
  const [upcomingBookedRides, setUpcomingBookedRides] = useState<Omit<RideCardProps, 'onBook' | 'onCancel'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    ridesHosted: 0,
    ridesTaken: 0,
    co2Saved: 0,
    moneySaved: 0
  });

  const [hostedRideIds, setHostedRideIds] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchRides = async () => {
    try {
      setLoading(true);
      
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error('You must be logged in to view your rides');
      }
      
      const userId = sessionData.session.user.id;
      setCurrentUserId(userId);
      
      // Fetch rides the user is hosting
      const { data: hostedData, error: hostedError } = await supabase
        .from('rides')
        .select('*')
        .eq('user_id', userId)
        .gt('seats_available', 0);
        
      if (hostedError) throw hostedError;
      
      // Store hosted ride IDs to state
      if (hostedData) {
        setHostedRideIds(hostedData.map((ride) => ride.id));
      } else {
        setHostedRideIds([]);
      }
      
      // Fetch rides the user has booked with confirmed status
      const { data: bookedData, error: bookedError } = await supabase
        .from('bookings')
        .select(`
          ride_id,
          seats_booked,
          status,
          rides (
            id, 
            pickup_location, 
            destination, 
            date, 
            time, 
            seats_available,
            user_id,
            profiles (
              full_name
            )
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'confirmed');
        
      if (bookedError) throw bookedError;
      
      // Format hosted rides for display
      const formattedHostedRides = hostedData ? hostedData.map(ride => ({
        id: ride.id,
        hostName: 'You',
        pickupLocation: ride.pickup_location,
        destination: ride.destination,
        date: new Date(ride.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: ride.time,
        seatsAvailable: ride.seats_available,
      })) : [];
      
      // Format booked rides for display
      const formattedBookedRides = bookedData ? bookedData
        .filter(booking => booking.rides) // Ensure ride data exists
        .map(booking => ({
          id: booking.ride_id,
          hostName: booking.rides.profiles?.full_name || 'Unknown Host',
          pickupLocation: booking.rides.pickup_location,
          destination: booking.rides.destination,
          date: new Date(booking.rides.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: booking.rides.time,
          seatsAvailable: 0, // Already booked
        })) : [];
      
      setUpcomingHostedRides(formattedHostedRides);
      setUpcomingBookedRides(formattedBookedRides);
      
      // Calculate stats
      const totalHosted = formattedHostedRides.length;
      const totalTaken = formattedBookedRides.length;
      const estimatedCO2PerRide = 4;
      const estimatedMoneyPerRide = 7;
      
      setStats({
        ridesHosted: totalHosted,
        ridesTaken: totalTaken,
        co2Saved: (totalHosted + totalTaken) * estimatedCO2PerRide,
        moneySaved: (totalHosted + totalTaken) * estimatedMoneyPerRide
      });
      
    } catch (error: any) {
      console.error("Error fetching rides:", error);
      toast({
        title: "Error",
        description: "Failed to load your rides. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
    
    // Set up a subscription for real-time updates
    const channel = supabase
      .channel('dashboard-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'rides' }, 
        () => fetchRides()
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => fetchRides()
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!hostedRideIds.length || !currentUserId) return;

    // Listen for new bookings (INSERT) on bookings table ONLY for hosted rides not by current user
    const bookingAlertChannel = supabase
      .channel('booking-alerts-dash')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
          filter: `ride_id=in.(${hostedRideIds.join(',')})`
        },
        async (payload) => {
          const booking = payload.new;
          // Only trigger if booked by another user (not self)
          if (booking && booking.user_id !== currentUserId) {
            // Fetch the ride details for a nice notification
            const { data: rideDetails } = await supabase
              .from('rides')
              .select('destination,pickup_location')
              .eq('id', booking.ride_id)
              .maybeSingle();

            let rideDest = "";
            let ridePickup = "";
            if (rideDetails) {
              rideDest = rideDetails.destination;
              ridePickup = rideDetails.pickup_location;
            }
            toast({
              title: "Ride Booked!",
              description: `Your ride${rideDest ? ` to ${rideDest}` : ""} has just been booked by a rider.`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(bookingAlertChannel);
    };
  }, [hostedRideIds, currentUserId, toast]);

  const cancelRide = async (id: string) => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error('You must be logged in to cancel a ride');
      }
      
      const userId = sessionData.session.user.id;
      
      // Check if this is a ride the user is hosting or has booked
      const isHosted = upcomingHostedRides.some(ride => ride.id === id);
      
      if (isHosted) {
        // Delete the hosted ride
        const { error } = await supabase
          .from('rides')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);
          
        if (error) throw error;
      } else {
        // Cancel the booking and update ride seats
        const { error: bookingError } = await supabase
          .from('bookings')
          .update({ status: 'cancelled' })
          .eq('ride_id', id)
          .eq('user_id', userId);
          
        if (bookingError) throw bookingError;
        
        // Increase available seats back
        const { success, error: updateError } = await increaseAvailableSeats(id, 1);
        
        if (!success || updateError) {
          throw updateError || new Error('Failed to update seat availability');
        }
      }
      
      toast({
        title: "Ride cancelled",
        description: "The ride has been successfully cancelled.",
      });
      
      // Refresh ride data
      fetchRides();
    } catch (error: any) {
      console.error(`Error cancelling ride ${id}:`, error);
      toast({
        title: "Cancellation failed",
        description: error.message || "An error occurred while cancelling the ride.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your rides.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Upcoming Rides</h2>
                <Link to="/ride-history">
                  <Button variant="ghost" className="text-golocal-primary hover:text-golocal-secondary">
                    View History
                  </Button>
                </Link>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading your rides...</p>
                </div>
              ) : upcomingHostedRides.length === 0 && upcomingBookedRides.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You don't have any upcoming rides.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/host-ride">
                      <Button className="bg-golocal-primary hover:bg-golocal-secondary">
                        Host a Ride
                      </Button>
                    </Link>
                    <Link to="/book-ride">
                      <Button variant="outline" className="border-golocal-primary text-golocal-primary hover:bg-golocal-softpurple">
                        Book a Ride
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {upcomingHostedRides.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Rides You're Hosting</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {upcomingHostedRides.map((ride) => (
                          <RideCard 
                            key={ride.id}
                            {...ride}
                            onCancel={cancelRide}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {upcomingBookedRides.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Rides You're Taking</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {upcomingBookedRides.map((ride) => (
                          <RideCard 
                            key={ride.id}
                            {...ride}
                            onCancel={cancelRide}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="md:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>What would you like to do?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to="/host-ride" className="block">
                  <Button className="w-full bg-golocal-primary hover:bg-golocal-secondary">
                    Host a New Ride
                  </Button>
                </Link>
                <Link to="/book-ride" className="block">
                  <Button variant="outline" className="w-full border-golocal-primary text-golocal-primary hover:bg-golocal-softpurple">
                    Find a Ride
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rides Hosted</span>
                    <span className="font-semibold">{stats.ridesHosted}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rides Taken</span>
                    <span className="font-semibold">{stats.ridesTaken}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">CO₂ Saved</span>
                    <span className="font-semibold">{stats.co2Saved} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Money Saved</span>
                    <span className="font-semibold">${stats.moneySaved}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-500">
                  Based on estimated calculations
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
