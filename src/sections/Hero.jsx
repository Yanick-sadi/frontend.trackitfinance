import { ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import dashboard from '../assets/dashboard.jpg';

const Hero = () => {
  return (
    <div className='bg-primary min-h-screen relative overflow-hidden'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl'></div>
        <div className='absolute bottom-20 right-10 w-40 h-40 bg-yellow-300 rounded-full blur-3xl'></div>
        <div className='absolute top-1/2 left-1/3 w-24 h-24 bg-secondary rounded-full blur-2xl'></div>
      </div>

      <div className='container mx-auto px-6 pt-36 pb-12 relative z-10'>
        {/* Hero Content */}
        <div className='text-center mb-16'>
          <h1 className='text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight'>
            Welcome to
            <br />
            <span className='text-secondary'>TrackItFinance</span>
          </h1>

          <p className='text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto'>
            Effortlessly manage your organization's finances with our collaborative, easy-to-use platform.
          </p>

          {/* CTA Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-16'>
            <Button className='bg-yellow-400 hover:bg-yellow-300 text-slate-800 font-semibold px-8 py-4 rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1'>
              Get Started Free
              <ArrowRight size={20} />
            </Button>
            <Button className='border-2 border-white/40 hover:border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-lg transition-all duration-300 flex items-center gap-2'>
              Request Demo
            </Button>
          </div>
        </div>
        <div className='w-full flex justify-center  '>
          {/* Image */}
          <img src={dashboard} alt='dashboard image' className='overflow-hidden rounded-md w-[50vw]' />
        </div>
      </div>
    </div>
  );
};

export default Hero;
