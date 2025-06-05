import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Label } from '../../components/Label';
import { Textarea } from '../../components/Textarea';
import { Skeleton } from '../../components/Skeleton';
import { Alert, AlertDescription } from '../../components/Alert';
import Empty from '../../components/Empty';
import Error from '../../components/Error';
import Layout from '../../layout';
import { useGetOrganizationQuery, useUpdateOrganizationMutation } from '../../redux/api/apiSlice';
import { adminNavLinks } from '../../constants';
import { Building2, MapPin, Calendar, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const OrganizationSettings = () => {
  const { data: organization, error, isLoading, refetch } = useGetOrganizationQuery();
  const [updateOrganization] = useUpdateOrganizationMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      name: '',
      address: '',
    },
  });

  // Set form values when organization data loads
  useEffect(() => {
    if (organization?.data) {
      reset({
        name: organization.data.name || '',
        address: organization.data.address || '',
      });
    }
  }, [organization, reset]);

  // Clear save status after 3 seconds
  useEffect(() => {
    if (saveStatus) {
      const timer = setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const onSubmit = async data => {
    console.log({ data });
    try {
      const res = await updateOrganization({
        id: organization.data.id,
        data,
      }).unwrap();

      if (res.ok) {
        setSaveStatus('success');
        setIsEditing(false);
        refetch();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error.data.message);
      setSaveStatus('error');
    }
  };

  const handleCancel = () => {
    reset({
      name: organization?.data?.name || '',
      address: organization?.data?.address || '',
    });
    setIsEditing(false);
    setSaveStatus(null);
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className='space-y-8'>
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-48' />
          <Skeleton className='h-4 w-64' />
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-10 w-full' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-24 w-full' />
          </div>
          <Skeleton className='h-10 w-24' />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-48' />
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='text-center space-y-2'>
                <Skeleton className='h-12 w-12 mx-auto rounded-full' />
                <Skeleton className='h-6 w-16 mx-auto' />
                <Skeleton className='h-4 w-24 mx-auto' />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading) {
    return (
      <Layout navLinks={adminNavLinks}>
        <div className='mx-4'>
          <div className='mb-6'>
            <h3 className='font-bold text-xl text-gray-900'>Organization Settings</h3>
            <p className='text-gray-600 text-sm mt-1'>Manage your organization information and settings</p>
          </div>
          <LoadingSkeleton />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout navLinks={adminNavLinks}>
        <div className='mx-4'>
          <div className='mb-6'>
            <h3 className='font-bold text-xl text-gray-900'>Organization Settings</h3>
            <p className='text-gray-600 text-sm mt-1'>Manage your organization information and settings</p>
          </div>
          <Card>
            <CardContent className='p-6'>
              <Error description='Error loading organization settings. Please try again.' />
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!organization?.data) {
    return (
      <Layout navLinks={adminNavLinks}>
        <div className='mx-4'>
          <div className='mb-6'>
            <h3 className='font-bold text-xl text-gray-900'>Organization Settings</h3>
            <p className='text-gray-600 text-sm mt-1'>Manage your organization information and settings</p>
          </div>
          <Card>
            <CardContent className='p-6'>
              <Empty description='No organization data found.' />
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const orgData = organization.data;

  return (
    <Layout navLinks={adminNavLinks}>
      <div className='mx-4'>
        <div className='mb-6'>
          <h3 className='font-bold text-xl text-gray-900'>Organization Settings</h3>
          <p className='text-gray-600 text-sm mt-1'>Manage your organization information and settings</p>
        </div>

        {/* Success/Error Messages */}
        {saveStatus === 'success' && (
          <Alert className='mb-6 border-green-200 bg-green-50'>
            <CheckCircle className='h-4 w-4 text-green-600' />
            <AlertDescription className='text-green-800'>Organization settings updated successfully!</AlertDescription>
          </Alert>
        )}

        {saveStatus === 'error' && (
          <Alert className='mb-6 border-red-200 bg-red-50'>
            <AlertCircle className='h-4 w-4 text-red-600' />
            <AlertDescription className='text-red-800'>
              Failed to update organization settings. Please try again.
            </AlertDescription>
          </Alert>
        )}

        <div className='space-y-8'>
          {/* Organization Information Card */}
          <Card className='shadow-sm border-0'>
            <CardHeader className='pb-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle className='text-lg font-semibold text-gray-900 flex items-center'>
                    <Building2 className='w-5 h-5 mr-2 text-primary' />
                    Organization Information
                  </CardTitle>
                  <p className='text-sm text-gray-600 mt-1'>Update your organization's basic information</p>
                </div>
                {!isEditing && (
                  <Button variant='outline' onClick={() => setIsEditing(true)} className='text-sm'>
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='name' className='text-sm font-medium text-gray-700'>
                      Organization Name <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='name'
                      type='text'
                      placeholder='Enter organization name'
                      {...register('name', {
                        required: 'Organization name is required',
                        minLength: { value: 2, message: 'Name must be at least 2 characters' },
                        maxLength: { value: 100, message: 'Name must not exceed 100 characters' },
                      })}
                      className={`w-full ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='address' className='text-sm font-medium text-gray-700'>
                      Address
                    </Label>
                    <Textarea
                      id='address'
                      placeholder='Enter organization address'
                      rows={4}
                      {...register('address', {
                        maxLength: { value: 500, message: 'Address must not exceed 500 characters' },
                      })}
                      className={`w-full resize-none ${errors.address ? 'border-red-500' : ''}`}
                    />
                    {errors.address && <p className='text-red-500 text-xs mt-1'>{errors.address.message}</p>}
                  </div>

                  <div className='flex justify-end gap-3 pt-4 border-t border-primary/20'>
                    <Button type='button' variant='outline' onClick={handleCancel} disabled={isSubmitting}>
                      Cancel
                    </Button>
                    <Button
                      type='submit'
                      className='bg-primary hover:bg-primary/80'
                      disabled={isSubmitting || !isDirty}
                    >
                      {isSubmitting ? (
                        <>
                          <div className='w-4 h-4 border-2 border-t border-primary/20 rounded-full animate-spin mr-2' />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className='w-4 h-4 mr-2' />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-1'>
                      <span className='text-sm font-medium text-gray-700'>Organization Name:</span>
                      <p className='text-sm text-gray-900 font-medium'>{orgData.name}</p>
                    </div>
                    <div className='space-y-1'>
                      <span className='text-sm font-medium text-gray-700'>Organization ID:</span>
                      <p className='text-sm font-mono bg-gray-100 px-2 py-1 rounded inline-block'>#{orgData.id}</p>
                    </div>
                  </div>

                  <div className='space-y-1'>
                    <span className='text-sm font-medium text-gray-700 flex items-center'>
                      <MapPin className='w-4 h-4 mr-1' />
                      Address:
                    </span>
                    <p className='text-sm text-gray-900'>{orgData.address || 'No address provided'}</p>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200'>
                    <div className='space-y-1'>
                      <span className='text-sm font-medium text-gray-700 flex items-center'>
                        <Calendar className='w-4 h-4 mr-1' />
                        Created:
                      </span>
                      <p className='text-sm text-gray-900'>{format(new Date(orgData.createdAt), 'PPP')}</p>
                    </div>
                    <div className='space-y-1'>
                      <span className='text-sm font-medium text-gray-700 flex items-center'>
                        <Calendar className='w-4 h-4 mr-1' />
                        Last Updated:
                      </span>
                      <p className='text-sm text-gray-900'>{format(new Date(orgData.updatedAt), 'PPP')}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default OrganizationSettings;
