export default function FeatureCard({ icon, title, description }) {
    return (
        <div
            className="
            w-full min-w-0
            bg-white
            border border-gray-200
            rounded-xl
            shadow-sm
            hover:shadow-md
            transition
            overflow-hidden
            "
        role="article"
        tabIndex={0}
        aria-label={title}
        >
        
        {/* Top Accent Bar */}
        <div 
        className="h-1 bg-blue-500/40 w-full" 
        />

        <div 
        className="p-6 flex flex-col items-center text-center gap-4"
        >
        
        {/* Icon Image (SVG) */}
        <div 
        className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"
        >
            <div 
            className="w-6 h-6 overflow-hidden flex items-center justify-center"
            >
                {icon}
            </div>
        </div>

        {/* Title */}
        <h3 
        className="text-lg font-semibold text-gray-900"
        >
            {title}
        </h3>

        {/* Description */}
        <p 
        className="text-gray-600 text-sm leading-relaxed"
        >
            {description}
        </p>
        </div>
    </div>
  );
}