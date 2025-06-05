import { Card, CardContent } from '../../components/Card';
import { Skeleton } from '../../components/Skeleton';
import Empty from '../../components/Empty';
import Error from '../../components/Error';
import Layout from '../../layout';
import { useGetMyProfileQuery } from '../../redux/api/apiSlice';
import { format } from 'date-fns';
import { employeeNavLinks } from '../../constants';
import { User, Mail, Briefcase, Calendar, DollarSign, Shield, Activity } from 'lucide-react';

const EmployeeProfile = () => {
  const { data: profile, error, isLoading } = useGetMyProfileQuery({});

  // Skeleton loading component
  const ProfileSkeleton = () => (
    <div className='space-y-6'>
      <Card className='shadow-sm border-0'>
        <CardContent className='p-6'>
          <div className='flex items-center space-x-4 mb-6'>
            <Skeleton className='h-16 w-16 rounded-full' />
            <div className='space-y-2'>
              <Skeleton className='h-6 w-48' />
              <Skeleton className='h-4 w-32' />
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className='space-y-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-5 w-36' />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const getStatusBadge = status => {
    const statusClasses = {
      Active: 'bg-green-100 text-green-800 border-green-200',
      Inactive: 'bg-red-100 text-red-800 border-red-200',
      Suspended: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          statusClasses[status] || 'bg-gray-100 text-gray-800 border-gray-200'
        }`}
      >
        <Activity className='w-3 h-3 mr-1' />
        {status}
      </span>
    );
  };

  const getRoleBadge = role => {
    const roleClasses = {
      Admin: 'bg-purple-100 text-purple-800 border-purple-200',
      Employee: 'bg-blue-100 text-blue-800 border-blue-200',
      Manager: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          roleClasses[role] || 'bg-gray-100 text-gray-800 border-gray-200'
        }`}
      >
        <Shield className='w-3 h-3 mr-1' />
        {role}
      </span>
    );
  };

  return (
    <Layout navLinks={employeeNavLinks}>
      <div className='mx-4'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='font-bold text-xl text-gray-900'>Manage my Profile</h3>
        </div>

        {isLoading ? (
          <ProfileSkeleton />
        ) : error ? (
          <Card className='shadow-sm border-0'>
            <CardContent className='p-6'>
              <Error description='Error loading profile information' />
            </CardContent>
          </Card>
        ) : !profile || !profile.data ? (
          <Card className='shadow-sm border-0'>
            <CardContent className='p-6'>
              <Empty description='Profile information not found.' />
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-6'>
            {/* Main Profile Card */}
            <Card className='shadow-sm border-0'>
              <CardContent className='p-6'>
                {/* Profile Header */}
                <div className='flex items-center space-x-4 mb-8 pb-6 border-b border-gray-100'>
                  <div className='h-16 w-16 bg-primary rounded-full flex items-center justify-center'>
                    <User className='h-8 w-8 text-white' />
                  </div>
                  <div className='flex-1'>
                    <h2 className='text-2xl font-bold text-gray-900'>{profile.data.user.fullName}</h2>
                    <div className='flex items-center space-x-3 mt-2'>
                      <p className='text-gray-600 text-lg'>{profile.data.position}</p>
                      {getRoleBadge(profile.data.user.role)}
                      {getStatusBadge(profile.data.user.status)}
                    </div>
                  </div>
                </div>

                {/* Profile Details Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  {/* Personal Information */}
                  <div className='space-y-6'>
                    <h3 className='text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2'>
                      Personal Information
                    </h3>

                    <div className='space-y-4'>
                      <div className='flex items-start space-x-3'>
                        <Mail className='h-5 w-5 text-gray-400 mt-0.5' />
                        <div>
                          <span className='text-sm font-medium text-gray-700 block'>Email Address</span>
                          <p className='text-sm text-gray-900'>{profile.data.user.email}</p>
                        </div>
                      </div>

                      <div className='flex items-start space-x-3'>
                        <User className='h-5 w-5 text-gray-400 mt-0.5' />
                        <div>
                          <span className='text-sm font-medium text-gray-700 block'>Employee ID</span>
                          <p className='text-sm text-gray-900'>EMP-{String(profile.data.id).padStart(4, '0')}</p>
                        </div>
                      </div>

                      <div className='flex items-start space-x-3'>
                        <Shield className='h-5 w-5 text-gray-400 mt-0.5' />
                        <div>
                          <span className='text-sm font-medium text-gray-700 block'>User Role</span>
                          <p className='text-sm text-gray-900'>{profile.data.user.role}</p>
                        </div>
                      </div>

                      <div className='flex items-start space-x-3'>
                        <Activity className='h-5 w-5 text-gray-400 mt-0.5' />
                        <div>
                          <span className='text-sm font-medium text-gray-700 block'>Account Status</span>
                          <p className='text-sm text-gray-900'>{profile.data.user.status}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Employment Information */}
                  <div className='space-y-6'>
                    <h3 className='text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2'>
                      Employment Information
                    </h3>

                    <div className='space-y-4'>
                      <div className='flex items-start space-x-3'>
                        <Briefcase className='h-5 w-5 text-gray-400 mt-0.5' />
                        <div>
                          <span className='text-sm font-medium text-gray-700 block'>Position</span>
                          <p className='text-sm text-gray-900'>{profile.data.position}</p>
                        </div>
                      </div>

                      <div className='flex items-start space-x-3'>
                        <DollarSign className='h-5 w-5 text-gray-400 mt-0.5' />
                        <div>
                          <span className='text-sm font-medium text-gray-700 block'>Monthly Salary</span>
                          <p className='text-sm font-semibold text-green-600'>
                            Rwf {parseFloat(profile.data.salary).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-start space-x-3'>
                        <Calendar className='h-5 w-5 text-gray-400 mt-0.5' />
                        <div>
                          <span className='text-sm font-medium text-gray-700 block'>Hire Date</span>
                          <p className='text-sm text-gray-900'>{format(new Date(profile.data.hireDate), 'PPP')}</p>
                        </div>
                      </div>

                      <div className='flex items-start space-x-3'>
                        <Calendar className='h-5 w-5 text-gray-400 mt-0.5' />
                        <div>
                          <span className='text-sm font-medium text-gray-700 block'>Years of Service</span>
                          <p className='text-sm text-gray-900'>
                            {Math.floor(
                              (new Date() - new Date(profile.data.hireDate)) / (365.25 * 24 * 60 * 60 * 1000)
                            )}{' '}
                            years
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Record Information */}
                <div className='mt-8 pt-6 border-t border-gray-100'>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>Record Information</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <span className='text-sm font-medium text-gray-700 block'>Profile Created</span>
                      <p className='text-sm text-gray-600'>{format(new Date(profile.data.createdAt), 'PPpp')}</p>
                    </div>
                    {profile.data.updatedAt && profile.data.updatedAt !== profile.data.createdAt && (
                      <div>
                        <span className='text-sm font-medium text-gray-700 block'>Last Updated</span>
                        <p className='text-sm text-gray-600'>{format(new Date(profile.data.updatedAt), 'PPpp')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EmployeeProfile;
