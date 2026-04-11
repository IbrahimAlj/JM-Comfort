import Navbar from '../components/Navbar';
import PageMeta from '../components/PageMeta';
import UATFeedbackForm from '../components/UATFeedbackForm';

export default function UATFeedback() {
  return (
    <>
      <PageMeta
        title="Client Feedback | JM Comfort"
        description="Submit your feedback for the JM Comfort website during user acceptance testing."
      />
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Client Feedback</h1>
        <p className="text-gray-500 text-lg mb-10">
          Thank you for helping us test the JM Comfort website. Please share your observations below.
        </p>
        <UATFeedbackForm />
      </main>
    </>
  );
}
