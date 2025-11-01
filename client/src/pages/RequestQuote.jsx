import Navbar from '../components/Navbar';

export default function RequestQuote() {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">Request a Quote</h1>
        <p className="text-gray-700 text-lg leading-relaxed">
          Your quote request form goes here...
        </p>
      </div>
    </>
  );
}