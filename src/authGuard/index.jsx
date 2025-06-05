import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';

const AuthGuard = ({ allowedRoles = [] }) => {
  const { userToken } = useSelector(state => state.auth);
  const { user } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (userToken && user?.role && allowedRoles.length > 0) {
      const userRole = user.role.toLowerCase();
      const hasRequiredRole = allowedRoles.some(role => role.toLowerCase() === userRole);

      if (!hasRequiredRole) {
        setIsRedirecting(true);
      }
    }
  }, [userToken, user, allowedRoles]);

  if (!userToken) {
    return <Navigate to='/login' replace />;
  }

  if (allowedRoles.length > 0) {
    const userRole = user?.role?.toLowerCase();
    const hasRequiredRole = allowedRoles.some(role => role.toLowerCase() === userRole);

    if (!hasRequiredRole) {
      if (isRedirecting) {
        return (
          <div className='flex min-h-screen items-center justify-center'>
            <div className='flex flex-col items-center justify-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4'></div>
              <p className='text-sm text-gray-600'>Redirecting to your dashboard...</p>
            </div>
          </div>
        );
      }

      if (userRole === 'admin') {
        return <Navigate to='/admin/dashboard' replace />;
      } else if (userRole === 'employee') {
        return <Navigate to='/employee/dashboard' replace />;
      } else {
        return <Navigate to='/unauthorized' replace />;
      }
    }
  }

  return <Outlet />;
};

export default AuthGuard;
