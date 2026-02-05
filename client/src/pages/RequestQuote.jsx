import Navbar from '../components/Navbar';
import { useNavigate } from "react-router-dom";

export default function RequestQuote() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">Request a Quote</h1>
        <p className="text-gray-700 text-lg leading-relaxed">
          Your quote request form goes here...
        </p>

        <button
          onClick={() => navigate("/confirmation")}
          className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Submit (temporary)
        </button>
      </div>
    </>
  );
}