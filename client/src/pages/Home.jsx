import HeroBanner from '../components/HeroBanner';
import Navbar from '../components/Navbar';
import WhyChooseUs from '../components/WhyChooseUs';
import PageMeta from '../components/PageMeta';

export default function Home() {
  return (
    <>
      <PageMeta
        title="JM Comfort | Trusted HVAC Services in Sacramento, CA"
        description="Reliable, energy-efficient heating and cooling for Sacramento homes and businesses. Family-owned JM Comfort—trusted service, honest pricing, comfort and care."
      />
      <Navbar />
      <main>
        <HeroBanner />
        <WhyChooseUs />

        {/* Add other homepage sections below */}
        {/* Services preview, testimonials, etc. */}
      </main>
    </>
  );
}
