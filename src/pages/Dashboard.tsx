
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import VehicleCard from '@/components/vehicles/VehicleCard';
import AddVehicleForm from '@/components/vehicles/AddVehicleForm';
import AddServiceRecordForm from '@/components/service-records/AddServiceRecordForm';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const { vehicles, serviceRecords } = useAppContext();
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<any>(null);

  const handleEditVehicle = (id: string) => {
    const vehicle = vehicles.find(v => v.id === id);
    if (vehicle) {
      setEditVehicle(vehicle);
      setIsAddVehicleOpen(true);
    }
  };

  const handleAddVehicleClose = () => {
    setIsAddVehicleOpen(false);
    setEditVehicle(null);
  };

  // Find vehicles that need service soon (in the next 30 days)
  const vehiclesNeedingService = vehicles.filter(vehicle => {
    if (!vehicle.nextServiceDate) return false;
    const nextServiceDate = new Date(vehicle.nextServiceDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    return nextServiceDate <= thirtyDaysFromNow && nextServiceDate >= today;
  });

  // Find vehicles that have overdue services
  const overdueServiceVehicles = vehicles.filter(vehicle => {
    if (!vehicle.nextServiceDate) return false;
    const nextServiceDate = new Date(vehicle.nextServiceDate);
    const today = new Date();
    return nextServiceDate < today;
  });

  return (
    <MainLayout title="Dashboard">
      <div className="space-y-8">
        <DashboardStats />

        {(overdueServiceVehicles.length > 0 || vehiclesNeedingService.length > 0) && (
          <div className="space-y-4">
            {overdueServiceVehicles.length > 0 && (
              <Alert variant="destructive">
                <AlertTitle>Overdue Services</AlertTitle>
                <AlertDescription>
                  You have {overdueServiceVehicles.length} vehicle{overdueServiceVehicles.length !== 1 ? 's' : ''} with overdue service. Please schedule maintenance soon.
                </AlertDescription>
              </Alert>
            )}

            {vehiclesNeedingService.length > 0 && overdueServiceVehicles.length === 0 && (
              <Alert>
                <AlertTitle>Upcoming Services</AlertTitle>
                <AlertDescription>
                  You have {vehiclesNeedingService.length} vehicle{vehiclesNeedingService.length !== 1 ? 's' : ''} due for service in the next 30 days.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Your Vehicles</h2>
            <p className="text-muted-foreground">Manage your vehicles and track their service history</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsAddServiceOpen(true)}>
              Add Service Record
            </Button>
            <Button onClick={() => setIsAddVehicleOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Vehicles</TabsTrigger>
            {overdueServiceVehicles.length > 0 && (
              <TabsTrigger value="overdue" className="text-red">
                Overdue ({overdueServiceVehicles.length})
              </TabsTrigger>
            )}
            {vehiclesNeedingService.length > 0 && (
              <TabsTrigger value="upcoming">
                Due Soon ({vehiclesNeedingService.length})
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="all">
            {vehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map(vehicle => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onEdit={handleEditVehicle}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No vehicles found</CardTitle>
                  <CardDescription>
                    You haven't added any vehicles yet. Add your first vehicle to get started.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button onClick={() => setIsAddVehicleOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Your First Vehicle
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="overdue">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {overdueServiceVehicles.map(vehicle => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onEdit={handleEditVehicle}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehiclesNeedingService.map(vehicle => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onEdit={handleEditVehicle}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {isAddVehicleOpen && (
        <AddVehicleForm 
          open={isAddVehicleOpen} 
          onClose={handleAddVehicleClose}
          editVehicle={editVehicle}
        />
      )}

      {isAddServiceOpen && (
        <AddServiceRecordForm 
          open={isAddServiceOpen} 
          onClose={() => setIsAddServiceOpen(false)}
        />
      )}
    </MainLayout>
  );
};

export default Dashboard;
