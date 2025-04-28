
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Menu, 
  CarFront, 
  Calendar, 
  Bell, 
  FileText, 
  Settings, 
  User, 
  Sun,
  Moon,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger
} from '@/components/ui/sheet';
import { useAppContext } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type MainLayoutProps = {
  children: React.ReactNode;
  title: string;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  const { user, logout, darkMode, toggleDarkMode } = useAppContext();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const navigationItems = [
    { name: 'Dashboard', icon: <CarFront className="h-5 w-5" />, path: '/' },
    { name: 'Service Records', icon: <FileText className="h-5 w-5" />, path: '/service-records' },
    { name: 'Reminders', icon: <Bell className="h-5 w-5" />, path: '/reminders' },
    { name: 'Calendar', icon: <Calendar className="h-5 w-5" />, path: '/calendar' },
    { name: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/settings' },
  ];

  const DesktopSidebar = () => (
    <div
      className={cn(
        "h-screen fixed top-0 left-0 z-40 bg-white dark:bg-navy border-r border-gray-200 dark:border-gray-800 transition-all duration-300",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          {sidebarOpen ? (
            <Link to="/" className="flex items-center space-x-2">
              <CarFront className="h-6 w-6 text-sky" />
              <span className="text-xl font-semibold text-navy dark:text-white">ServiceTrack</span>
            </Link>
          ) : (
            <CarFront className="h-6 w-6 text-sky mx-auto" />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-full p-1 h-8 w-8"
          >
            <ChevronLeft className={cn("h-5 w-5 transition-transform", !sidebarOpen && "rotate-180")} />
          </Button>
        </div>

        <nav className="flex-grow p-4 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                window.location.pathname === item.path
                  ? "bg-gray-100 dark:bg-gray-800 text-navy dark:text-white"
                  : "text-slate dark:text-gray-300"
              )}
            >
              {item.icon}
              {sidebarOpen && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          {sidebarOpen ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name || ''} />
                  <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleDarkMode}
                className="justify-start"
              >
                {darkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
              
              <Button 
                variant="outline"
                size="sm" 
                onClick={logout}
                className="justify-start"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl} alt={user?.name || ''} />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleDarkMode}
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const MobileSidebar = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full bg-white dark:bg-navy">
          <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-800">
            <Link to="/" className="flex items-center space-x-2">
              <CarFront className="h-6 w-6 text-sky" />
              <span className="text-xl font-semibold text-navy dark:text-white">ServiceTrack</span>
            </Link>
          </div>

          <nav className="flex-grow p-4 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                  window.location.pathname === item.path
                    ? "bg-gray-100 dark:bg-gray-800 text-navy dark:text-white"
                    : "text-slate dark:text-gray-300"
                )}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl} alt={user?.name || ''} />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleDarkMode}
                className="w-full justify-start"
              >
                {darkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="w-full justify-start"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-slate dark:text-gray-100">
      {isMobile ? <MobileSidebar /> : <DesktopSidebar />}
      
      <main className={cn(
        "transition-all duration-300 min-h-screen",
        isMobile ? "ml-0" : (sidebarOpen ? "ml-64" : "ml-20")
      )}>
        <div className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {isMobile && <MobileSidebar />}
              <h1 className="text-2xl font-bold text-navy dark:text-white">{title}</h1>
            </div>
            <div className="flex items-center space-x-2">
              {!isMobile && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hidden md:flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    <span>{user?.name}</span>
                  </Button>
                </>
              )}
            </div>
          </div>
          <Separator className="mb-6" />
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
