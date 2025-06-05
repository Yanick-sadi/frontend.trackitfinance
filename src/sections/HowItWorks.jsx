import { Play, CheckCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/Accordion';
import howItWorks from '../assets/howItWorks.jpg';

const HowItWorks = () => {
  const steps = [
    {
      id: 'signup',
      number: '1',
      title: 'Sign Up',
      content: [
        'Create your account with basic information',
        'Verify your email and set up security',
        'Complete your profile with employment details',
      ],
    },
    {
      id: 'profile',
      number: '2',
      title: 'Set Up Your Profile',
      content: [
        'Add your personal and financial information',
        'Connect your salary details for automatic deductions',
        'Set your savings preferences and goals',
      ],
    },
    {
      id: 'service',
      number: '3',
      title: 'Start Using Our Service',
      content: [
        'Apply for loans with our simple application process',
        'Track your savings and monitor growth',
        'Set and achieve your financial goals',
      ],
    },
    {
      id: 'support',
      number: '4',
      title: 'Get Support',
      content: [
        'Access 24/7 customer support when needed',
        'Get help with loan applications and approvals',
        'Receive guidance on financial planning',
      ],
    },
  ];

  return (
    <div className='bg-primary/5 py-24' id='howItWorks'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          {/* Left Side - Content */}
          <div>
            <div className='mb-8'>
              <p className='text-secondary font-medium text-sm mb-2'>How It Works</p>
              <h2 className='text-3xl md:text-4xl font-bold text-primary'>
                How Track<span className='text-secondary'>It</span>
                <span className='text-secondary'>Finance</span> Works
              </h2>
            </div>

            <Accordion type='single' collapsible defaultValue='signup' className='w-full'>
              {steps.map(step => (
                <AccordionItem key={step.id} value={step.id} className='border-b border-gray-200'>
                  <AccordionTrigger className='hover:no-underline py-6 text-left'>
                    <div className='flex items-center gap-4'>
                      <div className='w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0'>
                        {step.number}
                      </div>
                      <span className='text-lg font-semibold text-gray-900'>{step.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='pb-6'>
                    <div className='ml-12 space-y-3'>
                      {step.content.map((item, index) => (
                        <div key={index} className='flex items-start gap-3'>
                          <CheckCircle className='w-4 h-4 text-secondary mt-0.5 flex-shrink-0' />
                          <span className='text-gray-600 text-sm leading-relaxed'>{item}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Right Side - Image/Video */}
          <div className='relative'>
            <div className='relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden aspect-video'>
              {/* Placeholder for video/image */}
              <img src={howItWorks} alt='how it works image' />
            </div>

            {/* Decorative elements */}
            <div className='absolute -top-4 -right-4 w-8 h-8 bg-secondary/20 rounded-full'></div>
            <div className='absolute -bottom-4 -left-4 w-12 h-12 bg-primary/10 rounded-full'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
