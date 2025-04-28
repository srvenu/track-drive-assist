
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, isSameDay, addMonths, parseISO, isValid } from 'date-fns';

const Calendar = () => {
  const { vehicles } = useAppContext();
  const [date, setDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<Date>(new Date());
  
  // Get all service dates for the calendar
  const serviceDates = vehicles
    .filter(vehicle => vehicle.nextServiceDate && isValid(parseISO(vehicle.nextServiceDate)))
    .map(vehicle => ({
      id: vehicle.id,
      date: parseISO(vehicle.nextServiceDate || ''),
      make: vehicle.make,
      model: vehicle.model,
      licensePlate: vehicle.licensePlate
    }));
  
  // Check if a date has service scheduled
  const hasServiceOnDate = (date: Date) => {
    return serviceDates.some(service => isSameDay(service.date, date));
  };
  
  // Filter services for selected date
  const servicesForSelectedDate = serviceDates.filter(service => 
    isSameDay(service.date, date)
  );

  return (
    <MainLayout title="Calendar">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Calendar</CardTitle>
              <CardDescription>
                View and manage your upcoming service appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:space-x-4 justify-center">
                <div className="p-3">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    month={calendarView}
                    onMonthChange={setCalendarView}
                    className="rounded-md border w-full"
                    modifiers={{
                      serviceDay: (day) => hasServiceOnDate(day),
                    }}
                    modifiersStyles={{
                      serviceDay: {
                        fontWeight: 'bold',
                        backgroundColor: 'rgba(14, 165, 233, 0.15)',
                      },
                    }}
                  />
                </div>
                <div className="flex space-x-2 mt-4 sm:mt-0 sm:flex-col sm:space-x-0 sm:space-y-2 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setCalendarView(new Date())}
                  >
                    Today
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setCalendarView(addMonths(calendarView, 1))}
                  >
                    Next Month
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-1/3 space-y-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>
                {date ? format(date, 'MMMM d, yyyy') : 'No date selected'}
              </CardTitle>
              <CardDescription>
                {servicesForSelectedDate.length > 0 
                  ? `${servicesForSelectedDate.length} service${servicesForSelectedDate.length > 1 ? 's' : ''} scheduled`
                  : 'No services scheduled for this date'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {servicesForSelectedDate.length > 0 ? (
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {servicesForSelectedDate.map(service => {
                      const vehicle = vehicles.find(v => v.id === service.id);
                      
                      return (
                        <Card key={service.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">
                                  {service.make} {service.model}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {service.licensePlate}
                                </p>
                                <div className="flex items-center mt-2">
                                  <Badge variant="outline" className="bg-sky/10 text-sky border-sky/20">
                                    Service Due
                                  </Badge>
                                </div>
                              </div>
                              <Button size="sm" asChild>
                                <a href={`/service-records?vehicleId=${service.id}`}>View</a>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No services scheduled for this date</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Select a date with highlighted background to view scheduled services
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Calendar;
