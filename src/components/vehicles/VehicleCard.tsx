
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { type Vehicle } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (id: string) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onEdit }) => {
  const nextServiceDate = vehicle.nextServiceDate ? new Date(vehicle.nextServiceDate) : null;
  const isServiceSoon = nextServiceDate && nextServiceDate.getTime() - new Date().getTime() < 2592000000; // 30 days in ms
  
  const getServiceStatus = () => {
    if (!nextServiceDate) return { color: 'bg-gray-200 text-gray-800', text: 'No service scheduled' };
    
    if (nextServiceDate < new Date()) {
      return { color: 'bg-red-100 text-red-800 border-red-200', text: 'Service Overdue' };
    }
    
    if (isServiceSoon) {
      return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Service Soon' };
    }
    
    return { color: 'bg-green-100 text-green-800 border-green-200', text: 'Service Scheduled' };
  };
  
  const serviceStatus = getServiceStatus();
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-1">
        <div className={cn(
          "h-40 bg-gradient-to-r from-slate-100 to-gray-100 dark:from-gray-800 dark:to-slate-900", 
          "flex items-center justify-center rounded-t-lg"
        )}>
          <div className="text-6xl font-bold text-gray-400 dark:text-gray-600">{vehicle.make}</div>
        </div>
      </div>
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg">{vehicle.make} {vehicle.model}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{vehicle.year} • {vehicle.licensePlate}</p>
          </div>
          <Badge variant="outline" className={serviceStatus.color}>
            {serviceStatus.text}
          </Badge>
        </div>

        <div className="space-y-3 mt-4">
          {nextServiceDate && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300">Next service:</span>
              <span className="ml-auto font-medium">
                {formatDistanceToNow(nextServiceDate, { addSuffix: true })}
              </span>
            </div>
          )}
          
          <div className="flex items-center text-sm">
            <span className="text-gray-600 dark:text-gray-300">Current mileage:</span>
            <span className="ml-auto font-medium">
              {vehicle.currentMileage?.toLocaleString() || 'N/A'} miles
            </span>
          </div>
          
          {vehicle.nextServiceMileage && (
            <div className="flex items-center text-sm">
              <span className="text-gray-600 dark:text-gray-300">Service due at:</span>
              <span className="ml-auto font-medium">
                {vehicle.nextServiceMileage.toLocaleString()} miles
              </span>
            </div>
          )}
        </div>
        
        {vehicle.nextServiceMileage && vehicle.currentMileage && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress to next service</span>
              <span>
                {Math.min(
                  100, 
                  Math.round((vehicle.currentMileage / vehicle.nextServiceMileage) * 100)
                )}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div 
                className={cn(
                  "h-2 rounded-full",
                  isServiceSoon ? "bg-yellow-500" : "bg-sky"
                )}
                style={{ 
                  width: `${Math.min(100, Math.round((vehicle.currentMileage / vehicle.nextServiceMileage) * 100))}%` 
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t bg-gray-50 dark:bg-gray-800/50 flex justify-between px-6 py-3">
        <Button asChild variant="ghost" size="sm">
          <Link to={`/service-records?vehicleId=${vehicle.id}`}>
            Service History
          </Link>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onEdit(vehicle.id)}>
          <Settings className="h-4 w-4 mr-1" />
          Manage
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VehicleCard;
