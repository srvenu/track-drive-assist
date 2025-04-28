
import React from 'react';
import { CarFront } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  className 
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className={cn(
        "w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md",
        className
      )}>
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-sky/10 p-3 rounded-full">
              <CarFront className="h-8 w-8 text-sky" />
            </div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-navy dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
