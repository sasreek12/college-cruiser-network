
import { Clock, MapPin, User } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface RideCardProps {
  id: string;
  hostName: string;
  pickupLocation: string;
  destination: string;
  date: string;
  time: string;
  seatsAvailable: number;
  isHistory?: boolean;
  status?: 'completed' | 'cancelled' | 'upcoming';
  onBook?: (id: string) => void;
  onCancel?: (id: string) => void;
}

const RideCard = ({
  id,
  hostName,
  pickupLocation,
  destination,
  date,
  time,
  seatsAvailable,
  isHistory = false,
  status = 'upcoming',
  onBook,
  onCancel,
}: RideCardProps) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge className="bg-golocal-primary">Upcoming</Badge>;
    }
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">{pickupLocation} to {destination}</h3>
            <p className="text-sm text-gray-500">Hosted by {hostName}</p>
          </div>
          {isHistory && getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm">{date} · {time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm">Pickup: {pickupLocation}</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm">
              {seatsAvailable === 0 
                ? "No seats available" 
                : `${seatsAvailable} ${seatsAvailable === 1 ? 'seat' : 'seats'} available`}
            </span>
          </div>
        </div>
      </CardContent>
      {!isHistory && (
        <CardFooter className="pt-0">
          {onBook && seatsAvailable > 0 && (
            <Button 
              onClick={() => onBook(id)} 
              className="w-full bg-golocal-primary hover:bg-golocal-secondary"
            >
              Book Now
            </Button>
          )}
          {onCancel && (
            <Button 
              onClick={() => onCancel(id)} 
              variant="outline"
              className="w-full text-gray-600 border-gray-300"
            >
              Cancel
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default RideCard;
