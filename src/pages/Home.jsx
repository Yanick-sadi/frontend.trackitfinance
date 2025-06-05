import ContactUs from '../sections/ContactUs';
import Features from '../sections/Features';
import Hero from '../sections/Hero';
import HowItWorks from '../sections/HowItWorks';

const Home = () => {
  return (
    <main id='home'>
      <Hero />
      <Features />
      <HowItWorks />
      <ContactUs />
    </main>
  );
};

export default Home;
