
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import HostRideForm from "@/components/HostRideForm";
import { supabase } from "@/integrations/supabase/client";

const HostRide = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFormSubmit = async (data: any) => {
    try {
      // Get current user session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error('You must be logged in to host a ride');
      }
      
      const userId = sessionData.session.user.id;
      
      // Format the date to ISO string for Supabase
      let formattedDate;
      if (data.date && data.date._type === 'Date') {
        formattedDate = data.date.value.iso.split('T')[0]; // Just get the YYYY-MM-DD part
      } else if (data.date instanceof Date) {
        formattedDate = data.date.toISOString().split('T')[0];
      } else {
        throw new Error('Invalid date format');
      }
      
      // Insert the ride data into Supabase
      const { error: insertError } = await supabase
        .from('rides')
        .insert({
          user_id: userId,
          pickup_location: data.pickupLocation,
          destination: data.destination,
          date: formattedDate,
          time: data.time,
          seats_available: data.seatsAvailable
        });
        
      if (insertError) {
        throw new Error(insertError.message);
      }
      
      // Show success toast
      toast({
        title: "Ride created!",
        description: "Your ride has been successfully listed.",
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Error hosting ride:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to create ride. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Host a Ride</h1>
          <p className="text-gray-600">Share your journey with fellow students.</p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <HostRideForm onSubmit={handleFormSubmit} />
        </div>
      </main>
    </div>
  );
};

export default HostRide;
