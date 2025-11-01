import Navbar from '../components/Navbar';

export default function Contact() {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <p className="text-gray-700 text-lg leading-relaxed">
          Your contact form goes here...
        </p>
      </div>
    </>
  );
}