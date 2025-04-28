
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types for our app
export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  color?: string;
  image?: string;
  nextServiceDate?: string;
  nextServiceMileage?: number;
  currentMileage?: number;
};

export type ServiceRecord = {
  id: string;
  vehicleId: string;
  date: string;
  serviceType: string;
  description: string;
  cost: number;
  mileage: number;
  serviceCenter: string;
  notes?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

type AppContextType = {
  user: User | null;
  vehicles: Vehicle[];
  serviceRecords: ServiceRecord[];
  isAuthenticated: boolean;
  darkMode: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  addServiceRecord: (record: Omit<ServiceRecord, 'id'>) => void;
  updateServiceRecord: (id: string, record: Partial<ServiceRecord>) => void;
  deleteServiceRecord: (id: string) => void;
  toggleDarkMode: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample data for demo purposes
const sampleVehicles: Vehicle[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2018,
    licensePlate: 'ABC-1234',
    vin: '4T1BF1FK5HU123456',
    color: 'Silver',
    nextServiceDate: '2025-06-15',
    nextServiceMileage: 60000,
    currentMileage: 52345
  },
  {
    id: '2',
    make: 'Honda',
    model: 'CR-V',
    year: 2020,
    licensePlate: 'XYZ-7890',
    vin: '2HKRW1H53LH123456',
    color: 'Blue',
    nextServiceDate: '2025-07-10',
    nextServiceMileage: 30000,
    currentMileage: 26500
  },
  {
    id: '3',
    make: 'Ford',
    model: 'F-150',
    year: 2019,
    licensePlate: 'DEF-4567',
    vin: '1FTEW1EP0KFC12345',
    color: 'Black',
    nextServiceDate: '2025-05-20',
    nextServiceMileage: 45000,
    currentMileage: 42800
  }
];

const sampleServiceRecords: ServiceRecord[] = [
  {
    id: '101',
    vehicleId: '1',
    date: '2024-01-15',
    serviceType: 'Oil Change',
    description: 'Regular oil change with synthetic oil',
    cost: 65.99,
    mileage: 45000,
    serviceCenter: 'Express Lube'
  },
  {
    id: '102',
    vehicleId: '1',
    date: '2023-10-05',
    serviceType: 'Brake Service',
    description: 'Front brake pad replacement',
    cost: 260.50,
    mileage: 40000,
    serviceCenter: 'City Auto Repair'
  },
  {
    id: '103',
    vehicleId: '2',
    date: '2024-02-20',
    serviceType: 'Tire Rotation',
    description: 'Regular tire rotation',
    cost: 29.99,
    mileage: 22000,
    serviceCenter: 'Discount Tire'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize with sample data
  useEffect(() => {
    if (isAuthenticated) {
      setVehicles(sampleVehicles);
      setServiceRecords(sampleServiceRecords);
    } else {
      setVehicles([]);
      setServiceRecords([]);
    }
  }, [isAuthenticated]);

  // Set dark mode on body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const login = async (email: string, password: string) => {
    // Simulate authentication
    console.log(`Logging in with: ${email} and password: ${password}`);
    
    // Demo user
    if (email === 'demo@example.com' && password === 'demo1234') {
      const demoUser = {
        id: 'user1',
        name: 'Demo User',
        email: 'demo@example.com',
      };
      setUser(demoUser);
      setIsAuthenticated(true);
      return Promise.resolve();
    } else {
      return Promise.reject(new Error('Invalid credentials'));
    }
  };
  
  const signup = async (name: string, email: string, password: string) => {
    // Simulate signup
    console.log(`Signing up with name: ${name}, email: ${email}, and password: ${password}`);
    
    // Demo signup - always succeeds in this demo
    const newUser = {
      id: 'user' + Math.floor(Math.random() * 1000),
      name,
      email,
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
    return Promise.resolve();
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const addVehicle = (vehicle: Omit<Vehicle, 'id'>) => {
    const newVehicle = {
      ...vehicle,
      id: `vehicle-${Date.now()}`,
    };
    setVehicles([...vehicles, newVehicle]);
  };

  const updateVehicle = (id: string, vehicleUpdates: Partial<Vehicle>) => {
    setVehicles(vehicles.map((v) => (v.id === id ? { ...v, ...vehicleUpdates } : v)));
  };

  const deleteVehicle = (id: string) => {
    setVehicles(vehicles.filter((v) => v.id !== id));
    setServiceRecords(serviceRecords.filter((r) => r.vehicleId !== id));
  };

  const addServiceRecord = (record: Omit<ServiceRecord, 'id'>) => {
    const newRecord = {
      ...record,
      id: `service-${Date.now()}`,
    };
    setServiceRecords([...serviceRecords, newRecord]);
  };

  const updateServiceRecord = (id: string, recordUpdates: Partial<ServiceRecord>) => {
    setServiceRecords(serviceRecords.map((r) => (r.id === id ? { ...r, ...recordUpdates } : r)));
  };

  const deleteServiceRecord = (id: string) => {
    setServiceRecords(serviceRecords.filter((r) => r.id !== id));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        vehicles,
        serviceRecords,
        isAuthenticated,
        darkMode,
        login,
        signup,
        logout,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addServiceRecord,
        updateServiceRecord,
        deleteServiceRecord,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
