
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { useAppContext } from '@/contexts/AppContext';

const Login = () => {
  const { isAuthenticated } = useAppContext();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Sign in to your ServiceTrack account to continue"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
