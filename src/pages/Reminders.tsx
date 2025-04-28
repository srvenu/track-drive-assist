
import React, { useState } from 'react';
import { Bell, ChevronDown, ChevronUp, Mail, Phone, Settings } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useAppContext } from '@/contexts/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';

interface ReminderSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  advanceNotice: number; // days
}

const Reminders = () => {
  const { vehicles } = useAppContext();
  const { toast } = useToast();
  const [settings, setSettings] = useState<ReminderSettings>({
    email: true,
    sms: false,
    push: true,
    advanceNotice: 14
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [openVehicleId, setOpenVehicleId] = useState<string | null>(null);

  // Sort vehicles by nextServiceDate
  const sortedVehicles = [...vehicles].sort((a, b) => {
    if (!a.nextServiceDate) return 1;
    if (!b.nextServiceDate) return -1;
    return new Date(a.nextServiceDate).getTime() - new Date(b.nextServiceDate).getTime();
  });
  
  // Get upcoming service reminders
  const upcomingReminders = sortedVehicles.filter(vehicle => {
    if (!vehicle.nextServiceDate) return false;
    const nextServiceDate = new Date(vehicle.nextServiceDate);
    return nextServiceDate >= new Date();
  });
  
  // Get past due reminders
  const pastDueReminders = sortedVehicles.filter(vehicle => {
    if (!vehicle.nextServiceDate) return false;
    const nextServiceDate = new Date(vehicle.nextServiceDate);
    return nextServiceDate < new Date();
  });

  const handleSettingChange = (setting: keyof ReminderSettings, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    toast({
      title: 'Settings updated',
      description: 'Your reminder settings have been saved.',
    });
  };

  const handleSendTest = () => {
    toast({
      title: 'Test notification sent',
      description: 'Check your email for the test notification.',
    });
  };

  const toggleVehicle = (id: string) => {
    setOpenVehicleId(openVehicleId === id ? null : id);
  };

  return (
    <MainLayout title="Reminders">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Service Reminders</h2>
            <p className="text-muted-foreground">Configure and manage service reminders for your vehicles</p>
          </div>
          <Card className="w-full md:w-auto">
            <CardContent className="p-4 flex flex-row items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="email-notifications"
                  checked={settings.email}
                  onCheckedChange={(checked) => handleSettingChange('email', checked)}
                />
                <label
                  htmlFor="email-notifications"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="sms-notifications"
                  checked={settings.sms}
                  onCheckedChange={(checked) => handleSettingChange('sms', checked)}
                />
                <label
                  htmlFor="sms-notifications"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  SMS
                </label>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto"
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <CollapsibleContent>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when you want to receive service reminders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Notification Methods</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>Email Notifications</span>
                      </div>
                      <Switch
                        checked={settings.email}
                        onCheckedChange={(checked) => handleSettingChange('email', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>SMS Notifications</span>
                      </div>
                      <Switch
                        checked={settings.sms}
                        onCheckedChange={(checked) => handleSettingChange('sms', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4" />
                        <span>Push Notifications</span>
                      </div>
                      <Switch
                        checked={settings.push}
                        onCheckedChange={(checked) => handleSettingChange('push', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Notification Schedule</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {[7, 14, 30].map((days) => (
                        <Button
                          key={days}
                          variant={settings.advanceNotice === days ? "default" : "outline"}
                          onClick={() => handleSettingChange('advanceNotice', days)}
                        >
                          {days} days
                        </Button>
                      ))}
                    </div>
                    <div className="pt-2">
                      <Button onClick={handleSendTest} variant="outline" size="sm">
                        Send Test Notification
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
        
        <div className="space-y-6">
          {pastDueReminders.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Badge variant="destructive" className="mr-2">Overdue</Badge>
                Past Due Services
              </h2>
              
              <div className="space-y-4">
                {pastDueReminders.map((vehicle) => (
                  <Card key={vehicle.id} className="border-red-200 dark:border-red-900">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8 bg-red-100 text-red-700">
                            <AvatarFallback>{vehicle.make.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">
                              {vehicle.make} {vehicle.model} ({vehicle.year})
                            </CardTitle>
                            <CardDescription>{vehicle.licensePlate}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                          Overdue
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Collapsible
                        open={openVehicleId === vehicle.id}
                        onOpenChange={() => toggleVehicle(vehicle.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">Service was due: {vehicle.nextServiceDate && formatDistanceToNow(new Date(vehicle.nextServiceDate), { addSuffix: true })}</p>
                          </div>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                              {openVehicleId === vehicle.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="mt-2">
                          <Separator className="my-2" />
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 text-sm">
                              <span className="text-gray-500">Current mileage:</span>
                              <span>{vehicle.currentMileage?.toLocaleString() || 'N/A'} miles</span>
                            </div>
                            <div className="grid grid-cols-2 text-sm">
                              <span className="text-gray-500">Service due at:</span>
                              <span>{vehicle.nextServiceMileage?.toLocaleString() || 'N/A'} miles</span>
                            </div>
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button size="sm" asChild>
                              <a href={`/service-records?vehicleId=${vehicle.id}`}>
                                Schedule Service
                              </a>
                            </Button>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Upcoming Services</h2>
            
            {upcomingReminders.length > 0 ? (
              <div className="space-y-4">
                {upcomingReminders.map((vehicle) => {
                  const nextServiceDate = vehicle.nextServiceDate ? new Date(vehicle.nextServiceDate) : null;
                  const today = new Date();
                  const thirtyDaysFromNow = new Date(today);
                  thirtyDaysFromNow.setDate(today.getDate() + 30);
                  
                  const isServiceSoon = nextServiceDate && nextServiceDate <= thirtyDaysFromNow;
                  
                  return (
                    <Card 
                      key={vehicle.id} 
                      className={isServiceSoon ? "border-yellow-200 dark:border-yellow-900" : undefined}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8 bg-gray-100 dark:bg-gray-800">
                              <AvatarFallback>{vehicle.make.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">
                                {vehicle.make} {vehicle.model} ({vehicle.year})
                              </CardTitle>
                              <CardDescription>{vehicle.licensePlate}</CardDescription>
                            </div>
                          </div>
                          {isServiceSoon ? (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              Due Soon
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              Scheduled
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Collapsible
                          open={openVehicleId === vehicle.id}
                          onOpenChange={() => toggleVehicle(vehicle.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium">Service due: {vehicle.nextServiceDate && formatDistanceToNow(new Date(vehicle.nextServiceDate), { addSuffix: true })}</p>
                            </div>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm">
                                {openVehicleId === vehicle.id ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                          <CollapsibleContent className="mt-2">
                            <Separator className="my-2" />
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 text-sm">
                                <span className="text-gray-500">Current mileage:</span>
                                <span>{vehicle.currentMileage?.toLocaleString() || 'N/A'} miles</span>
                              </div>
                              <div className="grid grid-cols-2 text-sm">
                                <span className="text-gray-500">Service due at:</span>
                                <span>{vehicle.nextServiceMileage?.toLocaleString() || 'N/A'} miles</span>
                              </div>
                              {vehicle.nextServiceMileage && vehicle.currentMileage && (
                                <div className="pt-1">
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
                                      className={isServiceSoon ? "bg-yellow-500 h-2 rounded-full" : "bg-sky h-2 rounded-full"}
                                      style={{ 
                                        width: `${Math.min(100, Math.round((vehicle.currentMileage / vehicle.nextServiceMileage) * 100))}%` 
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex justify-end mt-4">
                              <Button size="sm" asChild>
                                <a href={`/service-records?vehicleId=${vehicle.id}`}>
                                  View Service History
                                </a>
                              </Button>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No upcoming services</CardTitle>
                  <CardDescription>
                    You don't have any upcoming service reminders.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    {vehicles.length > 0
                      ? "Add service dates to your vehicles to see upcoming reminders."
                      : "Add vehicles to your account to start tracking service schedules."}
                  </p>
                  <div className="flex justify-end mt-4">
                    <Button asChild>
                      <a href="/">Go to Dashboard</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Reminders;
