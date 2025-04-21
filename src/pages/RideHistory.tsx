
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import RideCard, { RideCardProps } from '@/components/RideCard';

const RideHistory = () => {
  // Mock data for past rides
  const [hostedRides] = useState<Omit<RideCardProps, 'onBook' | 'onCancel'>[]>([
    {
      id: '1',
      hostName: 'You',
      pickupLocation: 'Student Center',
      destination: 'Downtown',
      date: 'Apr 15, 2025',
      time: '5:30 PM',
      seatsAvailable: 0,
      isHistory: true,
      status: 'completed',
    },
    {
      id: '2',
      hostName: 'You',
      pickupLocation: 'Library',
      destination: 'Mall',
      date: 'Apr 10, 2025',
      time: '3:00 PM',
      seatsAvailable: 0,
      isHistory: true,
      status: 'cancelled',
    },
    {
      id: '3',
      hostName: 'You',
      pickupLocation: 'Gym',
      destination: 'Concert Hall',
      date: 'Apr 5, 2025',
      time: '7:00 PM',
      seatsAvailable: 0,
      isHistory: true,
      status: 'completed',
    },
  ]);

  const [bookedRides] = useState<Omit<RideCardProps, 'onBook' | 'onCancel'>[]>([
    {
      id: '4',
      hostName: 'Emily R.',
      pickupLocation: 'Student Union',
      destination: 'Airport',
      date: 'Apr 12, 2025',
      time: '8:00 AM',
      seatsAvailable: 0,
      isHistory: true,
      status: 'completed',
    },
    {
      id: '5',
      hostName: 'Jason T.',
      pickupLocation: 'Dorm B',
      destination: 'Shopping Center',
      date: 'Apr 8, 2025',
      time: '2:30 PM',
      seatsAvailable: 0,
      isHistory: true,
      status: 'completed',
    },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ride History</h1>
          <p className="text-gray-600">View your past rides and trips.</p>
        </div>
        
        <Tabs defaultValue="all" className="bg-white rounded-lg shadow-sm p-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="all">All Rides</TabsTrigger>
            <TabsTrigger value="hosted">Hosted</TabsTrigger>
            <TabsTrigger value="booked">Booked</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {hostedRides.length === 0 && bookedRides.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">You don't have any past rides.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {hostedRides.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Rides You Hosted</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {hostedRides.map((ride) => (
                        <RideCard key={ride.id} {...ride} />
                      ))}
                    </div>
                  </div>
                )}
                
                {bookedRides.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Rides You Booked</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {bookedRides.map((ride) => (
                        <RideCard key={ride.id} {...ride} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="hosted">
            {hostedRides.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">You haven't hosted any rides yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hostedRides.map((ride) => (
                  <RideCard key={ride.id} {...ride} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="booked">
            {bookedRides.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">You haven't booked any rides yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookedRides.map((ride) => (
                  <RideCard key={ride.id} {...ride} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default RideHistory;
