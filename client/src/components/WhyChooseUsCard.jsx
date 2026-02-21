import FeatureCard from "./FeatureCard";

/* ICONS (SVG) */
function IconShield() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="block w-full h-full" // add fill-current to keep the default coloring (black)
            aria-hidden="true"
        >
        <path 
            d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z" 
            fill="#3029e8" // can change the icon color here. 
        />
    </svg>
    );
}

function IconLeaf() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="block w-full h-full"
            aria-hidden="true"
        >
        <path 
            d="M20 4c-6 0-12 3-14 9-1 3-1 6-1 7 1 0 4 0 7-1 6-2 9-8 8-15z" 
            fill="#025702"
        />
    </svg>
    );
}

function IconHome() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="block w-full h-full fill-current" 
            aria-hidden="true"
        >
        <path 
            d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V11z" 
        />
    </svg>
    );
}

function IconSun() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="block w-full h-full"
            aria-hidden="true"
        >
      
        {/* Sun center (circle) */}
        <circle 
            cx="12" cy="12" r="5" 
            fill="#f3d219"
        />

        {/* Rays (lines) */}
        <g 
        stroke="#f3d219" 
        strokeWidth="2" 
        strokeLinecap="round"
        >
            <line x1="12" y1="1" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
            <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
            <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
        </g>
    </svg>
    );
}

/* Feature Card */
export default function WhyChooseUs() {
    const features = [
        {
        icon: <IconShield />,
        title: "Trustworthy",
        description: "Licensed, insured, and transparent service you can count on.",
        },
        
        {
        icon: <IconLeaf />,
        title: "Energy-Efficient",
        description: "Smart solutions that reduce energy use without sacrificing comfort.",
        },
    
        {
        icon: <IconHome />,
        title: "Family-Owned",
        description: "Local, family-run business that treats your home like our own.",
        },
    
        {
        icon: <IconSun />,
        title: "24/7 Availability",
        description: "(DISCUSS) Can choose to keep or add, story suggests, it but need to reaffirm clients needs",
        },
    ];

    return (
        <section 
        className="py-16 px-4 bg-gray-50" 
        aria-labelledby="why-title"
        >
        
        <div 
        className="max-w-6xl mx-auto px-2"
        >
        
        <h2
            id="why-title"
            className="text-3xl font-bold text-center text-gray-900"
        >
          WHY CHOOSE US!
        </h2>

        {/* can add a description under WHY CHOOSE US! if needed */}
        <p 
        className="mt-3 text-center text-gray-600 max-w-2xl mx-auto"
        > 
        </p>

        {/* This has to do with mobile formatting, it might be a further problem later for testing, but for now it works. */}
        <style>
        {`
          /* scoped to .why-grid only - forces 1 column on small screens */
          @media (max-width: 640px) {
            .why-grid {
              grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
            }
          }
        `}
        </style>

        {/* GRID for 4 cards, NEED to change if one is either removed or one is to be added. */}
        <div className="mt-10 grid gap-6 grid-cols-4 why-grid">
            {features.map((feature) => (
            <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
            />
            ))}
        </div>
    </div>
    </section>
  );
}