import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import Navbar from '@/components/Navbar';
import RideCard, { RideCardProps } from '@/components/RideCard';
import { supabase } from '@/integrations/supabase/client';
import { decreaseAvailableSeats } from '@/integrations/supabase/functions';

const BookRide = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [searchQuery, setSearchQuery] = useState("");
  const [availableRides, setAvailableRides] = useState<Omit<RideCardProps, 'onCancel'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRides = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(sessionError.message);
      }
      
      const { data, error: ridesError } = await supabase
        .from('rides')
        .select('*, profiles(full_name)')
        .gt('seats_available', 0);
        
      if (ridesError) {
        throw new Error(ridesError.message);
      }

      if (!data) {
        setAvailableRides([]);
        return;
      }

      const formattedRides = data.map(ride => ({
        id: ride.id,
        hostName: ride.profiles?.full_name || 'Unknown Host',
        pickupLocation: ride.pickup_location,
        destination: ride.destination,
        date: format(new Date(ride.date), 'MMM dd, yyyy'),
        time: ride.time,
        seatsAvailable: ride.seats_available,
      }));

      setAvailableRides(formattedRides);
    } catch (err: any) {
      console.error('Error fetching rides:', err);
      setError('Failed to load rides. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to load available rides.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
    
    const channel = supabase
      .channel('public:rides')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'rides' }, 
        () => {
          fetchRides();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const bookRide = async (id: string) => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error('You must be logged in to book a ride');
      }
      
      const userId = sessionData.session.user.id;
      
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          ride_id: id,
          user_id: userId,
          seats_booked: 1
        });
        
      if (bookingError) {
        throw new Error(bookingError.message);
      }
      
      const { success, error: updateError } = await decreaseAvailableSeats(id, 1);
      
      if (!success || updateError) {
        throw new Error(updateError?.message || 'Failed to update seat availability');
      }
      
      toast({
        title: "Ride booked!",
        description: "You've successfully booked this ride.",
      });
      
      fetchRides();
    } catch (err: any) {
      console.error(`Error booking ride ${id}:`, err);
      toast({
        title: "Booking failed",
        description: err.message || "An error occurred while booking the ride.",
        variant: "destructive"
      });
    }
  };

  const filteredRides = availableRides.filter(ride => {
    if (
      searchQuery && 
      !ride.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ride.destination.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    if (date) {
      const rideDate = ride.date;
      if (!rideDate.includes(format(date, "MMM dd, yyyy"))) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book a Ride</h1>
          <p className="text-gray-600">Find and book rides offered by other students.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input 
                  placeholder="Search by location or destination..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Available Rides</h2>
            <Button 
              variant="outline" 
              onClick={fetchRides}
              className="text-sm"
            >
              Refresh Rides
            </Button>
          </div>
          
          {loading ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">Loading available rides...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">{error}</p>
              <Button 
                onClick={fetchRides} 
                className="mt-4 bg-golocal-primary hover:bg-golocal-secondary"
              >
                Try Again
              </Button>
            </div>
          ) : filteredRides.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 mb-2">No rides match your filters.</p>
              <p className="text-gray-500">Try adjusting your search or date criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRides.map((ride) => (
                <RideCard 
                  key={ride.id}
                  {...ride}
                  onBook={bookRide}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookRide;
