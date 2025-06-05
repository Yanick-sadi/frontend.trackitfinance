import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { specialRoutes } from '../constants';
import { Button } from './Button';

const Navbar = () => {
  const path = useLocation().pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isSpecialRoute = specialRoutes.includes(path);
  const isHomePage = path === '/' || path === '/home';

  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Handle navigation to sections
  const handleSectionNavigation = sectionId => {
    closeMenu();

    if (isHomePage) {
      // If on home page, just scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on another page, scroll to top first, then navigate to home with section hash
      window.scrollTo({ top: 0, behavior: 'auto' });
      navigate(`/#${sectionId}`);
    }
  };

  // Handle home navigation
  const handleHomeNavigation = () => {
    closeMenu();
    // Always scroll to top first
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (!isHomePage) {
      navigate('/');
    }
  };

  // Handle regular page navigation with scroll to top
  const handlePageNavigation = path => {
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'auto' });
    navigate(path);
  };

  // Handle scroll to section after navigation (for deep linking)
  useEffect(() => {
    if (isHomePage && window.location.hash) {
      const sectionId = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Small delay to ensure page is loaded
    }
  }, [isHomePage, path]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const screenHeight = window.innerHeight;
      setIsScrolled(scrollY > screenHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {isSpecialRoute ? null : (
        <div className='fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md text-white'>
          <div className='container mx-auto px-6 py-4 relative'>
            {/* Desktop Navigation */}
            <div className='flex justify-between items-center'>
              {/* Logo */}
              <button onClick={handleHomeNavigation} className='text-left'>
                <h1
                  className={`font-extrabold text-3xl ${
                    isScrolled ? 'text-primary' : 'text-white'
                  } hover:opacity-80 transition-opacity`}
                >
                  Track<span className='text-secondary'>It</span>
                  <span className='text-secondary'>Finance</span>
                </h1>
              </button>

              {/* Desktop Menu Items */}
              <div className='hidden lg:flex justify-center items-center gap-5'>
                <button
                  onClick={() => handleSectionNavigation('features')}
                  className={`${
                    isScrolled ? 'text-primary' : 'text-white'
                  } hover:text-secondary transition-colors duration-200`}
                >
                  Features
                </button>

                <button
                  onClick={() => handleSectionNavigation('howItWorks')}
                  className={`${
                    isScrolled ? 'text-primary' : 'text-white'
                  } hover:text-secondary transition-colors duration-200`}
                >
                  How it works
                </button>

                <button
                  onClick={() => handleSectionNavigation('contact-us')}
                  className={`${
                    isScrolled ? 'text-primary' : 'text-white'
                  } hover:text-secondary transition-colors duration-200`}
                >
                  Contact Us
                </button>
              </div>

              {/* Desktop CTAs */}
              <div className='hidden lg:flex space-x-3'>
                <Button
                  className={`${
                    isScrolled
                      ? 'bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30'
                      : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                  }`}
                  onClick={() => handlePageNavigation('/login')}
                >
                  Sign In
                </Button>
                <Button
                  className='bg-secondary text-slate-800 hover:bg-secondary'
                  onClick={() => handlePageNavigation('/get-started')}
                >
                  Get Started
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <div className='lg:hidden'>
                <button
                  onClick={toggleMenu}
                  className={`flex flex-col justify-center items-center w-8 h-8 space-y-1 focus:outline-none z-50 relative ${
                    isScrolled ? 'text-primary' : 'text-white'
                  }`}
                  aria-label='Toggle menu'
                >
                  <span
                    className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
                      isMenuOpen ? 'rotate-45 translate-y-2' : ''
                    }`}
                  />
                  <span
                    className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
                      isMenuOpen ? 'opacity-0' : ''
                    }`}
                  />
                  <span
                    className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
                      isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
              className={`lg:hidden fixed top-full left-0 w-full bg-primary shadow-lg border-t border-white/20 z-40 transition-all duration-300 ease-in-out ${
                isMenuOpen
                  ? 'opacity-100 transform translate-y-0'
                  : 'opacity-0 transform -translate-y-2 pointer-events-none'
              }`}
            >
              <div className='container mx-auto px-6 py-6 space-y-4'>
                {/* Mobile Menu Items */}
                <div className='flex flex-col space-y-4'>
                  <button
                    onClick={() => handleSectionNavigation('features')}
                    className='block py-2 text-white hover:text-secondary transition-colors duration-200 text-left'
                  >
                    Features
                  </button>

                  <button
                    onClick={() => handleSectionNavigation('howItWorks')}
                    className='block py-2 text-white hover:text-secondary transition-colors duration-200 text-left'
                  >
                    How it works
                  </button>

                  <button
                    onClick={() => handleSectionNavigation('contact-us')}
                    className='block py-2 text-white hover:text-secondary transition-colors duration-200 text-left'
                  >
                    Contact Us
                  </button>
                </div>

                {/* Mobile CTAs */}
                <div className='flex flex-col space-y-3 pt-4 border-t border-white/20'>
                  <Button
                    className='bg-white/20 text-white hover:bg-white/30 border border-white/30 w-full'
                    onClick={() => handlePageNavigation('/login')}
                  >
                    Sign In
                  </Button>
                  <Button
                    className='bg-secondary text-slate-800 hover:bg-secondary w-full'
                    onClick={() => handlePageNavigation('/get-started')}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
