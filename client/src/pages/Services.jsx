import { services } from '../data/services';

export default function Services() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Our Services</h1>
        <p className="text-gray-700 text-lg leading-relaxed mb-12">
          Professional HVAC solutions for your home or business
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.slug} className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-lg">
              <div className="h-48 bg-gray-200 relative">
                {service.image && (
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                )}
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.shortDescription}</p>
                <p className="text-blue-600 font-semibold mb-6">Starting at {service.pricing.starting}</p>
                
                <a href={`/services/${service.slug}`} className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  View Details
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}