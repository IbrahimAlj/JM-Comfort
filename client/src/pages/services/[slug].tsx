import { useParams, useNavigate } from 'react-router-dom';
import { services } from '../../data/services';

export default function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <button 
          onClick={() => navigate('/services')}
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          Back to Services
        </button>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          <div className="relative h-96 md:h-full min-h-[400px] rounded-lg overflow-hidden bg-gray-800">
            {service.image ? (
              <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Image coming soon</p>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.title}</h1>

            <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-3xl font-bold text-blue-400 mb-2">Starting at {service.pricing.starting}</p>
              <p className="text-gray-400 text-sm">{service.pricing.description}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">About This Service</h2>
              <p className="text-gray-300 leading-relaxed">{service.fullDescription}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">What&apos;s Included</h2>
              <ul className="space-y-3">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-6 h-6 text-green-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/book-service" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-center transition-colors">
                Book This Service
              </a>
              <a href="/contact" className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-8 rounded-lg text-center transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help Deciding?</h2>
            <p className="text-gray-300 mb-6">Our expert team is here to answer your questions and help you choose the right service for your needs.</p>
            <a href="/contact" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
              Get a Free Consultation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}