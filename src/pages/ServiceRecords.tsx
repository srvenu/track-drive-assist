
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import ServiceRecordTable from '@/components/service-records/ServiceRecordTable';
import AddServiceRecordForm from '@/components/service-records/AddServiceRecordForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { ServiceRecord } from '@/contexts/AppContext';

const ServiceRecords = () => {
  const { serviceRecords, vehicles } = useAppContext();
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<ServiceRecord | undefined>(undefined);
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get('vehicleId');
  
  const filteredVehicle = vehicleId 
    ? vehicles.find(vehicle => vehicle.id === vehicleId)
    : null;

  const handleEditRecord = (record: ServiceRecord) => {
    setEditRecord(record);
    setIsAddServiceOpen(true);
  };
  
  const handleAddServiceClose = () => {
    setIsAddServiceOpen(false);
    setEditRecord(undefined);
  };

  return (
    <MainLayout title={filteredVehicle ? `Service Records for ${filteredVehicle.make} ${filteredVehicle.model}` : "Service Records"}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              {filteredVehicle 
                ? `Service History: ${filteredVehicle.make} ${filteredVehicle.model} (${filteredVehicle.year})`
                : "All Service Records"
              }
            </h2>
            <p className="text-muted-foreground">
              {filteredVehicle
                ? `View and manage service records for this vehicle`
                : "View and manage all service records"
              }
            </p>
          </div>
          <Button 
            onClick={() => setIsAddServiceOpen(true)}
            disabled={vehicles.length === 0}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Service Record
          </Button>
        </div>

        {serviceRecords.length > 0 || vehicles.length === 0 ? (
          serviceRecords.length > 0 ? (
            <ServiceRecordTable 
              vehicleId={vehicleId || undefined} 
              onEdit={handleEditRecord}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No vehicles found</CardTitle>
                <CardDescription>
                  You need to add a vehicle before you can add service records.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild>
                  <a href="/">Go to Dashboard</a>
                </Button>
              </CardFooter>
            </Card>
          )
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No service records found</CardTitle>
              <CardDescription>
                You haven't added any service records yet. Add your first service record to get started.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => setIsAddServiceOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Service Record
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>

      {isAddServiceOpen && (
        <AddServiceRecordForm 
          open={isAddServiceOpen} 
          onClose={handleAddServiceClose}
          presetVehicleId={vehicleId || undefined}
          editRecord={editRecord}
        />
      )}
    </MainLayout>
  );
};

export default ServiceRecords;
