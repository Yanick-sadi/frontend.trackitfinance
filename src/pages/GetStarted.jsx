import { useState } from 'react';
import { User, Mail, Lock, Check, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useRegisterOrganizationMutation } from '../redux/api/apiSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const GetStarted = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    fullName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const [registerOrganization, { isLoading, error, isSuccess }] = useRegisterOrganizationMutation();

  const navigate = useNavigate();

  const steps = [
    { number: 1, title: 'Organization', completed: currentStep > 1 },
    { number: 2, title: 'Admin Info', completed: currentStep > 2 },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Organization name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        try {
          // Use RTK mutation to register organization
          const res = await registerOrganization({
            name: formData.name,
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
          }).unwrap();

          if (res.ok) {
            toast.success(res.message);
            navigate('/login');
          } else {
            toast.error('Registration of the organization failed');
          }
        } catch (err) {
          // Handle API errors
          if (err.data?.message) {
            setErrors({ submit: err.data.message });
          } else {
            setErrors({ submit: 'Registration failed. Please try again.' });
          }
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  return (
    <div className='min-h-screen bg-primary flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md'>
        {/* Progress Steps */}
        <div className='flex items-center justify-center mb-8'>
          {steps.map((step, index) => (
            <div key={step.number} className='flex items-center'>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.completed
                    ? 'bg-green-500 text-white'
                    : step.number === currentStep
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.completed ? <Check className='w-4 h-4' /> : step.number}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  step.number === currentStep ? 'text-gray-900' : step.completed ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-px mx-4 ${step.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Success Message */}
        {isSuccess && (
          <div className='mb-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
            <p className='text-green-800 text-sm'>Organization registered successfully!</p>
          </div>
        )}

        {/* General Error Message */}
        {(error || errors.submit) && (
          <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-red-800 text-sm'>
              {errors.submit || error?.data?.message || 'An error occurred. Please try again.'}
            </p>
          </div>
        )}

        {/* Step Content */}
        <div className='mb-8'>
          {currentStep === 1 && (
            <div>
              <h2 className='text-xl font-semibold text-gray-900 mb-2'>Create your organization</h2>
              <p className='text-gray-600 mb-6'>Let's start with the basics</p>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    What's your organization's name?
                  </label>
                  <Input
                    type='text'
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    placeholder='Epic Finance Co'
                    className={` ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : 'border-input'}`}
                  />
                  {errors.name && <p className='mt-1 text-sm text-red-500'>{errors.name}</p>}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className='text-xl font-semibold text-gray-900 mb-2'>Admin Information</h2>
              <p className='text-gray-600 mb-6'>Set up your admin account details</p>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name</label>
                  <div className='relative'>
                    <User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                    <Input
                      type='text'
                      value={formData.fullName}
                      onChange={e => handleInputChange('fullName', e.target.value)}
                      placeholder='John Niyontwali'
                      className={`pl-8 ${
                        errors.fullName ? 'border-red-500 focus-visible:ring-red-500' : 'border-input'
                      }`}
                    />
                  </div>
                  {errors.fullName && <p className='mt-1 text-sm text-red-500'>{errors.fullName}</p>}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                    <Input
                      type='email'
                      value={formData.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      placeholder='nijohn0001@gmail.com'
                      className={`pl-8  ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : 'border-input'}`}
                    />
                  </div>
                  {errors.email && <p className='mt-1 text-sm text-red-500'>{errors.email}</p>}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={e => handleInputChange('password', e.target.value)}
                      placeholder='••••••••'
                      className={`pl-8 pr-10 ${
                        errors.password ? 'border-red-500 focus-visible:ring-red-500' : 'border-input'
                      }`}
                    />
                    <button
                      type='button'
                      onClick={togglePasswordVisibility}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none'
                    >
                      {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                    </button>
                  </div>
                  {errors.password && <p className='mt-1 text-sm text-red-500'>{errors.password}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className='flex justify-between items-center'>
          <div className='flex space-x-3 ml-auto'>
            {currentStep > 1 && (
              <Button onClick={handleBack} disabled={isLoading}>
                Back
              </Button>
            )}
            <Button onClick={handleNext} disabled={isLoading}>
              {isLoading ? (
                <div className='flex items-center'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                  {currentStep === 2 ? 'Setting up...' : 'Next'}
                </div>
              ) : currentStep === 2 ? (
                'Complete Setup'
              ) : (
                'Next'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
