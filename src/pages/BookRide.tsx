
import { useState } from 'react';
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

const BookRide = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data for available rides
  const [availableRides] = useState<Omit<RideCardProps, 'onCancel'>[]>([
    {
      id: '1',
      hostName: 'Michael T.',
      pickupLocation: 'Student Center',
      destination: 'Downtown',
      date: 'Apr 22, 2025',
      time: '5:30 PM',
      seatsAvailable: 3,
    },
    {
      id: '2',
      hostName: 'Sarah L.',
      pickupLocation: 'Library',
      destination: 'Mall',
      date: 'Apr 23, 2025',
      time: '3:00 PM',
      seatsAvailable: 2,
    },
    {
      id: '3',
      hostName: 'James K.',
      pickupLocation: 'Dorm C',
      destination: 'Airport',
      date: 'Apr 25, 2025',
      time: '6:00 AM',
      seatsAvailable: 1,
    },
  ]);

  const bookRide = (id: string) => {
    // This would connect to Supabase in a real implementation
    console.log(`Booked ride ${id}`);
    
    toast({
      title: "Ride booked!",
      description: "You've successfully booked this ride.",
    });
  };

  const filteredRides = availableRides.filter(ride => {
    // Filter by search query (case insensitive)
    if (
      searchQuery && 
      !ride.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !ride.destination.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    // Filter by date if selected
    if (date) {
      const rideDate = ride.date;
      // Note: In a real app, we'd do proper date comparison
      // This is just for demo purposes
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
          <h2 className="text-xl font-semibold">Available Rides</h2>
          
          {filteredRides.length === 0 ? (
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
