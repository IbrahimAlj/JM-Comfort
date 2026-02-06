import { useState } from "react";
import Navbar from "../components/Navbar";

const initialValues = { name: "", email: "", phone: "", address: "" };

export default function RequestQuote() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (v) => {
    const e = {};
    if (!v.name.trim()) e.name = "Name is required.";
    if (!v.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))
      e.email = "Please enter a valid email address.";
    if (!v.phone.trim()) e.phone = "Phone number is required.";
    else if (!/^[0-9+\-() ]{7,20}$/.test(v.phone))
      e.phone = "Please enter a valid phone number.";
    if (!v.address.trim()) e.address = "Address is required.";
    return e;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const next = validate(values);
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // No API call in this branch. Submit handler will be wired in JMHABIBI-151.
    setSubmitted(true);
  };

  const isDisabled = Object.keys(validate(values)).length > 0;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Request a Quote
        </h1>
        <p className="mt-2 text-gray-600">
          Fill out the form below and we will get back to you with a free
          estimate.
        </p>

        {submitted && (
          <div
            className="mt-6 rounded-lg border border-green-300 bg-green-50 p-4 text-sm text-green-800"
            role="alert"
          >
            Your quote request has been received. We will contact you soon.
          </div>
        )}

        {!submitted && (
          <form
            onSubmit={onSubmit}
            noValidate
            className="mt-8 space-y-6"
          >
            {/* Name */}
            <div>
              <label
                htmlFor="quote-name"
                className="block text-sm font-medium text-gray-700"
              >
                Name <span className="text-red-600">*</span>
              </label>
              <input
                id="quote-name"
                name="name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={onChange}
                placeholder="John Doe"
                className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-gray-900 shadow-sm outline-none transition focus:ring-2 focus:ring-black ${
                  errors.name
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:border-black"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="quote-email"
                className="block text-sm font-medium text-gray-700"
              >
                Email <span className="text-red-600">*</span>
              </label>
              <input
                id="quote-email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={onChange}
                placeholder="john@example.com"
                className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-gray-900 shadow-sm outline-none transition focus:ring-2 focus:ring-black ${
                  errors.email
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:border-black"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="quote-phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone <span className="text-red-600">*</span>
              </label>
              <input
                id="quote-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={onChange}
                placeholder="(555) 123-4567"
                className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-gray-900 shadow-sm outline-none transition focus:ring-2 focus:ring-black ${
                  errors.phone
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:border-black"
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="quote-address"
                className="block text-sm font-medium text-gray-700"
              >
                Address <span className="text-red-600">*</span>
              </label>
              <input
                id="quote-address"
                name="address"
                type="text"
                autoComplete="street-address"
                value={values.address}
                onChange={onChange}
                placeholder="1234 Elm St, Sacramento, CA 95819"
                className={`mt-1 block w-full rounded-lg border px-4 py-2.5 text-gray-900 shadow-sm outline-none transition focus:ring-2 focus:ring-black ${
                  errors.address
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-300 focus:border-black"
                }`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isDisabled}
              className={`w-full rounded-lg px-6 py-3 text-base font-semibold transition ${
                isDisabled
                  ? "cursor-not-allowed bg-gray-300 text-gray-500"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              Submit Quote Request
            </button>

            <p className="text-xs text-gray-500">* Required fields</p>
          </form>
        )}
      </main>
    </>
  );
}
