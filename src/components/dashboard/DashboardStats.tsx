
import React from 'react';
import { Wrench, Car, Bell, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { format, isAfter, isBefore, addDays } from 'date-fns';

const DashboardStats: React.FC = () => {
  const { vehicles, serviceRecords } = useAppContext();

  // Calculate stats
  const totalVehicles = vehicles.length;
  const totalServiceRecords = serviceRecords.length;
  
  // Calculate upcoming services in the next 30 days
  const upcomingServices = vehicles.filter(vehicle => {
    if (!vehicle.nextServiceDate) return false;
    const nextServiceDate = new Date(vehicle.nextServiceDate);
    const today = new Date();
    const thirtyDaysFromNow = addDays(today, 30);
    return isAfter(nextServiceDate, today) && isBefore(nextServiceDate, thirtyDaysFromNow);
  }).length;
  
  // Calculate overdue services
  const overdueServices = vehicles.filter(vehicle => {
    if (!vehicle.nextServiceDate) return false;
    const nextServiceDate = new Date(vehicle.nextServiceDate);
    const today = new Date();
    return isBefore(nextServiceDate, today);
  }).length;

  // Calculate total maintenance cost
  const totalMaintenanceCost = serviceRecords.reduce((sum, record) => sum + record.cost, 0);
  
  // Last service date
  const lastServiceRecord = [...serviceRecords].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  })[0];
  
  const lastServiceDate = lastServiceRecord 
    ? format(new Date(lastServiceRecord.date), 'MMM d, yyyy') 
    : 'No records';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Vehicles
          </CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalVehicles}</div>
          <p className="text-xs text-muted-foreground">
            {totalVehicles === 1 ? '1 vehicle registered' : `${totalVehicles} vehicles registered`}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Maintenance Records
          </CardTitle>
          <Wrench className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalServiceRecords}</div>
          <p className="text-xs text-muted-foreground">
            Last service: {lastServiceDate}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Upcoming Services
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingServices}</div>
          <p className="text-xs text-muted-foreground">
            In the next 30 days
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {overdueServices > 0 ? 'Overdue Services' : 'Total Spent'}
          </CardTitle>
          {overdueServices > 0 ? (
            <Bell className="h-4 w-4 text-red" />
          ) : (
            <div className="rounded-full w-4 h-4 bg-sky flex items-center justify-center">
              <span className="text-white text-xs font-bold">$</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {overdueServices > 0 ? (
            <>
              <div className="text-2xl font-bold text-red">{overdueServices}</div>
              <p className="text-xs text-muted-foreground">
                Service{overdueServices > 1 ? 's' : ''} past due
              </p>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">
                ${totalMaintenanceCost.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                On all maintenance
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
