import Navbar from '../components/Navbar';
import CustomerReviews from '../components/CustomerReviews';
import PageMeta from '../components/PageMeta';

export default function Reviews() {
  return (
    <>
      <PageMeta
        title="Customer Reviews | JM Comfort Sacramento HVAC"
        description="Read verified customer reviews for JM Comfort HVAC services in Sacramento. Rated 4.9 stars by local homeowners and businesses. See why neighbors trust us."
      />
      <Navbar />
      <CustomerReviews />
    </>
  );
}