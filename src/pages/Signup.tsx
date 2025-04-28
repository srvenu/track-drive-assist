
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import SignupForm from '@/components/auth/SignupForm';
import { useAppContext } from '@/contexts/AppContext';

const Signup = () => {
  const { isAuthenticated } = useAppContext();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Sign up for ServiceTrack to start tracking your vehicle services"
    >
      <SignupForm />
    </AuthLayout>
  );
};

export default Signup;
