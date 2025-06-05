import { useCallback, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation } from '../redux/api/apiSlice';
import { cn } from '../lib/utils';
import { Button } from '../components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { Input } from '../components/Input';
import { Label } from '../components/Label';
import { Eye, EyeOff } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/reducers/authSlice';
import { useAuth } from '../hooks/useAuth';

function LoginForm({ className, ...props }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useAuth();

  const navigateByRole = useCallback(
    userRole => {
      setIsRedirecting(true);
      const role = userRole?.toLowerCase();

      switch (role) {
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'employee':
          navigate('/employee/dashboard', { replace: true });
          break;
        default:
          console.warn(`Unknown user role: ${userRole}`);
          setErrors({ submit: 'Invalid user role. Please contact support.' });
          setIsRedirecting(false);
      }
    },
    [navigate]
  );

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setErrors(prev => ({ ...prev, submit: '' }));

    try {
      const res = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      if (res?.ok && res?.token) {
        dispatch(setCredentials(res.token));

        if (res?.role) {
          navigateByRole(res.role);
        }
      } else {
        setErrors({ submit: 'Login failed. Invalid response from server.' });
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err?.data?.message || err?.message || 'Login failed. Please try again.';
      setErrors({ submit: errorMessage });
    }
  };

  useEffect(() => {
    if (user?.role) {
      navigateByRole(user.role);
    }
  }, [user, navigateByRole]);

  if (isRedirecting) {
    return (
      <div className='flex flex-col items-center justify-center p-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4'></div>
        <p className='text-sm text-gray-600'>Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className='flex flex-col gap-6'>
              {errors.submit && (
                <div className='p-4 bg-red-50 border border-red-200 rounded-lg'>
                  <p className='text-red-800 text-sm'>{errors.submit}</p>
                </div>
              )}

              <div className='grid gap-3'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  disabled={isLoading}
                />
                {errors.email && <small className='text-sm text-red-500 -mt-2'>{errors.email}</small>}
              </div>

              <div className='grid gap-3'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Password</Label>
                </div>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Your password'
                    value={formData.password}
                    onChange={e => handleInputChange('password', e.target.value)}
                    className={errors.password ? 'border-red-500 focus-visible:ring-red-500 pr-10' : 'pr-10'}
                    disabled={isLoading}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute inset-y-0 right-0 flex items-center justify-center w-10 text-gray-500 hover:text-gray-700 disabled:opacity-50'
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                  </button>
                </div>
                {errors.password && <small className='text-sm text-red-500 -mt-2'>{errors.password}</small>}
              </div>

              <div className='flex flex-col gap-3'>
                <Button type='submit' className='w-full' disabled={isLoading}>
                  {isLoading ? (
                    <div className='flex items-center'>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                      Logging in...
                    </div>
                  ) : (
                    'Login'
                  )}
                </Button>
              </div>
            </div>
            <div className='mt-4 text-center text-sm'>
              Forgot your password?{' '}
              <Link to='/forgot-password' className='underline underline-offset-4'>
                Send a reset link
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      setIsRedirecting(true);
      const role = user.role.toLowerCase();
      switch (role) {
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'employee':
          navigate('/employee/dashboard', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  if (isAuthenticated || isRedirecting) {
    return (
      <div className='bg-primary flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
        <div className='flex flex-col items-center justify-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4'></div>
          <p className='text-sm text-white'>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-primary flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <LoginForm />
      </div>
    </div>
  );
}
