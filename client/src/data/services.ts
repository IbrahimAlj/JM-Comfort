export interface Service {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  pricing: {
    starting: string;
    description: string;
  };
  image?: string;
}

export const services: Service[] = [
  {
    slug: 'hvac-repair',
    title: 'HVAC Repair',
    shortDescription: 'Fast and reliable HVAC repair services',
    fullDescription: 'Our expert technicians provide comprehensive HVAC repair services to get your system running smoothly again. We diagnose and fix all types of heating and cooling issues, ensuring your comfort year-round.',
    features: [
      'Emergency 24/7 repair services',
      'Certified and experienced technicians',
      'All brands and models serviced',
      'Same-day service available',
      'Warranty on all repairs'
    ],
    pricing: {
      starting: '$89',
      description: 'Diagnostic fee, repair costs vary based on issue'
    },
    image: '/images/hvac-repair.jpg'
  },
  {
    slug: 'hvac-maintenance',
    title: 'HVAC Maintenance',
    shortDescription: 'Keep your system running efficiently',
    fullDescription: 'Regular maintenance is key to extending the life of your HVAC system. Our comprehensive maintenance plans include thorough inspections, cleaning, and tune-ups to prevent costly breakdowns.',
    features: [
      'Seasonal tune-ups',
      'Filter replacement',
      'System efficiency optimization',
      'Priority scheduling',
      'Discounts on repairs'
    ],
    pricing: {
      starting: '$129',
      description: 'Annual maintenance plan available'
    },
    image: '/images/hvac-maintenance.jpg'
  },
  {
    slug: 'hvac-installation',
    title: 'HVAC Installation',
    shortDescription: 'Professional installation of new systems',
    fullDescription: 'Whether you\'re building new or replacing an old system, our installation experts will help you choose and install the perfect HVAC system for your home or business. We ensure proper sizing and optimal performance.',
    features: [
      'Free in-home consultation',
      'Energy-efficient system options',
      'Professional installation',
      'System warranty included',
      'Financing options available'
    ],
    pricing: {
      starting: '$3,500',
      description: 'Price varies based on system size and type'
    },
    image: '/images/hvac-installation.jpg'
  }
];