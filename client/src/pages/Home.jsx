import HeroBanner from '../components/HeroBanner';
import Navbar from '../components/Navbar';
import WhyChooseUs from '../components/WhyChooseUs';

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroBanner />
      <WhyChooseUs />

      {/* Add other homepage sections below */}
      {/* Services preview, testimonials, etc. */}
    </>
  );
}
