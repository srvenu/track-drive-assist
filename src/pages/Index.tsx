
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import Dashboard from './Dashboard';

const Index = () => {
  const { isAuthenticated } = useAppContext();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <Dashboard />;
};

export default Index;
