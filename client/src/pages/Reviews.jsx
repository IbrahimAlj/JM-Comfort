import Navbar from '../components/Navbar';

export default function Reviews() {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">Customer Reviews</h1>
        <p className="text-gray-700 text-lg leading-relaxed">
          Your reviews content goes here...
        </p>
      </div>
    </>
  );
}