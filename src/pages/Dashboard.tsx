
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from '@/components/Navbar';
import RideCard, { RideCardProps } from '@/components/RideCard';

const Dashboard = () => {
  // Mock data for upcoming rides
  const [upcomingHostedRides] = useState<Omit<RideCardProps, 'onBook' | 'onCancel'>[]>([
    {
      id: '1',
      hostName: 'You',
      pickupLocation: 'Student Center',
      destination: 'Downtown',
      date: 'Apr 22, 2025',
      time: '5:30 PM',
      seatsAvailable: 2,
    },
  ]);

  const [upcomingBookedRides] = useState<Omit<RideCardProps, 'onBook' | 'onCancel'>[]>([
    {
      id: '2',
      hostName: 'Sarah L.',
      pickupLocation: 'Library',
      destination: 'Mall',
      date: 'Apr 23, 2025',
      time: '3:00 PM',
      seatsAvailable: 0,
    },
  ]);

  const cancelRide = (id: string) => {
    // This would connect to Supabase in a real implementation
    console.log(`Cancelled ride ${id}`);
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
              
              {upcomingHostedRides.length === 0 && upcomingBookedRides.length === 0 ? (
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
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rides Taken</span>
                    <span className="font-semibold">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">CO₂ Saved</span>
                    <span className="font-semibold">24 kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Money Saved</span>
                    <span className="font-semibold">$42</span>
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
