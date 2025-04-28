
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { useAppContext } from '@/contexts/AppContext';

const ForgotPassword = () => {
  const { isAuthenticated } = useAppContext();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Enter your email and we'll send you instructions to reset your password"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPassword;
