import { DollarSign, CreditCard, Building2, Target, User, Users } from 'lucide-react';
import { Button } from '../components/Button';

const Features = () => {
  const features = [
    {
      id: 'loan',
      icon: DollarSign,
      title: 'Loan Management',
      description: 'Apply for loans with transparent approval workflows and automated tracking.',
    },
    {
      id: 'saving',
      icon: CreditCard,
      title: 'Savings Tracking',
      description: 'Automated savings with salary deductions and manual contributions.',
    },
    {
      id: 'organization',
      icon: Building2,
      title: 'Organization Tools',
      description: 'Comprehensive organizational financial oversight and management.',
    },
    {
      id: 'personalgoal',
      icon: Target,
      title: 'Goal Setting',
      description: 'Set and track personal financial goals with progress monitoring.',
    },
    {
      id: 'profile',
      icon: User,
      title: 'Profile Management',
      description: 'Secure user profiles with personalized financial dashboards.',
    },
    {
      id: 'user',
      icon: Users,
      title: 'User Administration',
      description: 'Role-based access controls and comprehensive user management.',
    },
  ];

  return (
    <div className='min-h-screen bg-white py-16' id='features'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header Section */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 bg-secondary/5 border border-secondary/40 rounded-full px-4 py-1.5 mb-6 text-sm text-primary font-bold'>
            Our Features
          </div>
          <h1 className='text-3xl md:text-4xl font-bold mb-4 text-primary'>
            Track<span className='text-secondary'>It</span>
            <span className='text-secondary'>Finance</span> Features
          </h1>
          <p className='text-md text-gray-600 max-w-2xl mx-auto leading-relaxed'>
            Essential financial management tools for organizations and employees.
          </p>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16'>
          {features.map(feature => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className='bg-white border border-gray-200 rounded-xl p-6 hover:border-secondary/50 hover:shadow-sm transition-all duration-300 group'
              >
                {/* Feature Icon */}
                <div className='w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors'>
                  <IconComponent className='w-6 h-6 text-secondary' />
                </div>

                {/* Feature Content */}
                <h3 className='text-lg font-semibold text-primary mb-2'>{feature.title}</h3>
                <p className='text-gray-600 text-sm leading-relaxed'>{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className='bg-primary rounded-2xl p-8 md:p-12 text-center text-white'>
          <h2 className='text-2xl md:text-3xl font-bold mb-3'>Ready to Get Started?</h2>
          <p className='text-white/80 mb-6 max-w-xl mx-auto'>
            Transform your financial management with our comprehensive platform.
          </p>
          <Button className='bg-secondary hover:bg-secondary text-primary font-semibold px-6 py-3 rounded-lg transition-colors duration-300'>
            Start Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Features;
