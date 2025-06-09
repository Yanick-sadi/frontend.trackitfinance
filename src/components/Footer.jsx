import { Link, useLocation } from 'react-router-dom';
import instagram from '../assets/instagram.svg';
import twitter from '../assets/twitter.svg';
import whatsapp from '../assets/whatsapp.svg';
import { specialRoutes } from '../constants';

const Footer = () => {
  const path = useLocation().pathname;

  const isSpecialRoute = specialRoutes.includes(path);

  return (
    <>
      {isSpecialRoute ? null : (
        <footer className='bg-primary text-white border-t border-white/20'>
          <div className='container mx-auto px-4 py-12 max-w-7xl'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
              {/* Logo and description */}
              <div className='md:col-span-1'>
                <h2 className='font-extrabold text-2xl mb-4'>
                  Track<span className='text-secondary'>It</span><span className='text-secondary'>Finance</span>
                </h2>
                <p className='text-white/70 text-sm leading-relaxed'>
                  Empowering your financial journey with intuitive tracking and insights.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className='text-base font-semibold mb-4 uppercase tracking-wider'>Quick Links</h3>
                <ul className='space-y-3'>
                  {[
                    { to: '#features', text: 'Features' },
                    { to: '#pricing', text: 'Pricing' },
                    { to: '#how-it-works', text: 'How It Works' },
                    { to: '#contact-us', text: 'Contact Us' },
                  ].map(item => (
                    <li key={item.text}>
                      <a href={item.to} className='text-white/70 hover:text-secondary transition-colors text-sm'>
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className='text-base font-semibold mb-4 uppercase tracking-wider'>Legal</h3>
                <ul className='space-y-3'>
                  {[
                    { to: '/privacy', text: 'Privacy Policy' },
                    { to: '/terms', text: 'Terms of Service' },
                    { to: '/cookies', text: 'Cookie Policy' },
                  ].map(item => (
                    <li key={item.text}>
                      <Link to={item.to} className='text-white/70 hover:text-secondary transition-colors text-sm'>
                        {item.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className='text-base font-semibold mb-4 uppercase tracking-wider'>Contact Us</h3>
                <ul className='space-y-3'>
                  <li className='text-white/70 text-sm'>nckmuhire@gmail.com</li>
                  <li className='text-white/70 text-sm'>+250 782 598 553</li>
                  <li className='text-white/70 text-sm'>Kigali, Rwanda</li>
                </ul>
              </div>
            </div>

            {/* Bottom section */}
            <div className='border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center'>
              <p className='text-white/50 text-xs md:text-sm'>
                © {new Date().getFullYear()} TrackItFinance. All rights reserved.
              </p>
              <div className='flex space-x-6 mt-4 md:mt-0'>
                {[
                  {
                    icon: whatsapp,
                    alt: 'Whatsapp',
                    url: 'https://wa.me/250782598553',
                    label: 'WhatsApp',
                  },
                  {
                    icon: twitter,
                    alt: 'Twitter',
                    url: 'https://twitter.com',
                    label: 'Twitter',
                  },
                  {
                    icon: instagram,
                    alt: 'Instagram',
                    url: 'https://instagram.com',
                    label: 'Instagram',
                  },
                ].map(social => (
                  <a
                    href={social.url}
                    key={social.alt}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-white/70 hover:text-secondary transition-colors hover:scale-110 transform duration-200'
                    title={`Follow us on ${social.label}`}
                  >
                    <span className='sr-only'>{social.alt}</span>
                    <img
                      src={social.icon}
                      alt={`${social.label} icon`}
                      className='w-8 h-8 hover:opacity-80 transition-opacity'
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
