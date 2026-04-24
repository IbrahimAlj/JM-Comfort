import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageMeta from '../components/PageMeta';

export default function NotFound() {
  return (
    <>
      <PageMeta
        title="Page Not Found | JM Comfort"
        description="The page you were looking for does not exist."
      />
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-sm font-medium text-indigo-600">404</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">Page not found</h1>
        <p className="mt-4 text-base text-gray-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            to="/"
            className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            Go back home
          </Link>
          <Link to="/contact" className="text-sm font-medium text-indigo-600 hover:underline">
            Contact support &rarr;
          </Link>
        </div>
      </main>
    </>
  );
}
