import Hero from '../components/sections/Hero.jsx';
import Stats from '../components/sections/Stats.jsx';
import Features from '../components/sections/Features.jsx';
import HowItWorks from '../components/sections/HowItWorks.jsx';
import Testimonials from '../components/sections/Testimonials.jsx';
import CTABanner from '../components/sections/CTABanner.jsx';

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTABanner />
    </>
  );
}
