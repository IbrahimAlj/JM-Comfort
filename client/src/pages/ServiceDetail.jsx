import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageMeta from '../components/PageMeta';
import ServiceDetailComponent from '../components/ServiceDetail';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const [serviceName, setServiceName] = useState('');

  useEffect(() => {
    let mounted = true;
    fetch(`/api/services/${encodeURIComponent(id)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (mounted && data?.name) setServiceName(data.name);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <>
      <PageMeta
        title={serviceName ? `${serviceName} | JM Comfort` : 'Service Details | JM Comfort'}
        description="Explore JM Comfort HVAC services in detail — installation, repairs, and maintenance for Sacramento-area homes and businesses."
      />
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <Link to="/services" className="text-sm text-indigo-600 hover:underline">
          &larr; Back to Services
        </Link>

        <div className="mt-6">
          <ServiceDetailComponent />
        </div>
      </main>
    </>
  );
}
