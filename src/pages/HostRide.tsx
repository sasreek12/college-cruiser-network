
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import HostRideForm from "@/components/HostRideForm";

const HostRide = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFormSubmit = (data: any) => {
    // This would connect to Supabase in a real implementation
    console.log("Submitted ride data:", data);
    
    // Show success toast
    toast({
      title: "Ride created!",
      description: "Your ride has been successfully listed.",
    });
    
    // Redirect to dashboard
    navigate("/dashboard");
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
