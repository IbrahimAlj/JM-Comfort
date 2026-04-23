import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { captureError } from "../utils/captureError";
import PageMeta from "../components/PageMeta";
import {
  quoteInitialValues,
  validateQuote,
  validateQuoteField,
} from "../utils/requestQuoteValidation";

const fieldErrorClass = "mt-1 text-sm font-medium text-red-600";  // suppose to be the red invalid text that appears 
// currently not displaying the red color however. 

export default function RequestQuote() {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get("service");
  const [values, setValues] = useState(quoteInitialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Only revalidate while typing if the field has already been touched
    if (touched[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        const fieldError = validateQuoteField(name, value);

        if (fieldError) {
          next[name] = fieldError;
        } else {
          delete next[name];
        }
      return next;
      });
    }

    if (serverError) 
      setServerError("");
  };

  const onBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setErrors((prev) => {
      const next = { ...prev };
      const fieldError = validateQuoteField(name, value);

      if (fieldError) {
        next[name] = fieldError;
      } else {
        delete next[name];
    }
    return next;
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validateQuote(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    setServerError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          address: values.address.trim(),
          lead_type: "quote",
          service_type: preselectedService || undefined,
          preferred_date: values.preferred_date || undefined,
          preferred_time_slot: values.preferred_time_slot || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message =
          data && (data.error || data.message)
            ? data.error || data.message
            : "Something went wrong. Please try again.";

        setServerError(message);
        return;
      }

      setSubmitted(true);
      setValues(quoteInitialValues);
      setErrors({});
    } catch (err) {
      captureError(err, { page: "RequestQuote", action: "submitForm" });
      setServerError(
        "Unable to reach the server. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const hasEmptyRequired = ["name", "email", "phone", "address"].some(
    (key) => !values[key].trim()
  );

  const isDisabled =
    loading || Object.keys(errors).length > 0 || hasEmptyRequired;

  return (
    <>
      <PageMeta
        title="Request a Free HVAC Quote | JM Comfort Sacramento"
        description="Request a free HVAC estimate from JM Comfort. Fill out our quick form and a certified technician will contact you with honest, transparent pricing."
      />
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-10">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Request a Quote
        </h1>
        <p className="mt-4 text-xl text-gray-700 leading-8">
          Fill out the form below and we will get back to you with a free
          estimate of your inquiry!
        </p>

        {preselectedService && (
          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
            Service requested: <span className="font-semibold text-gray-900">{preselectedService}</span>
          </div>
        )}

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
            {serverError && (
              <div
                className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800"
                role="alert"
              >
                {serverError}
              </div>
            )}

            {/* Name */}
            <div>
              <label
                htmlFor="quote-name"
                className="block text-lg font-medium text-gray-800"
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
                onBlur={onBlur}
                disabled={loading}
                placeholder="John Doe"

                className={`mt-2 block w-full rounded-lg border px-5 py-3 text-lg text-gray-900 shadow-sm outline-none transition focus:ring-2 focus:ring-black ${
                  errors.name 
                  ? "border-red-400 focus:ring-red-400" 
                  : "border-gray-400 focus:border-black"
                }`}
              />
              
              <div style={{ minHeight: "24px", marginTop: "4px" }}>
                <p
                  role="alert"
                  style={{
                  color: "#dc2626",
                  fontSize: "13px",
                  fontWeight: 500,
                  margin: 0,
                  visibility: touched.name && errors.name ? "visible" : "hidden",
                  }}
                >
                {errors.name || "placeholder"}
                </p>
              </div>
            </div>


            {/* Email */}
            <div>
              <label
                htmlFor="quote-email"
                className="block text-lg font-medium text-gray-800"
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
                onBlur={onBlur}
                disabled={loading}
                placeholder="john@example.com"
                
                className={`mt-2 block w-full rounded-lg border px-5 py-3 text-lg text-gray-900 shadow-sm outline-none transition focus:ring-2 focus:ring-black ${
                  errors.email
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-400 focus:border-black"
                }`}
              />
              
              <div style={{ minHeight: "24px", marginTop: "4px" }}>
                <p
                  role="alert"
                  style={{
                  color: "#dc2626",
                  fontSize: "13px",
                  fontWeight: 500,
                  margin: 0,
                  visibility: touched.email && errors.email ? "visible" : "hidden",
                  }}
                >
                {errors.email || "placeholder"}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="quote-phone"
                className="block text-lg font-medium text-gray-800"
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
                onBlur={onBlur}
                disabled={loading}
                placeholder="(555) 123-4567"
                
                className={`mt-2 block w-full rounded-lg border px-5 py-3 text-lg text-gray-900 shadow-sm outline-none transition focus:ring-2 focus:ring-black ${
                  errors.phone
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-400 focus:border-black"
                }`}
              />
              <div style={{ minHeight: "24px", marginTop: "4px" }}>
                <p
                  role="alert"
                  style={{
                  color: "#dc2626",
                  fontSize: "13px",
                  fontWeight: 500,
                  margin: 0,
                  visibility: touched.phone && errors.phone ? "visible" : "hidden",
                  }}
                >
                {errors.phone || "placeholder"}
                </p>
              </div>
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="quote-address"
                className="block text-lg font-medium text-gray-800"
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
                onBlur={onBlur}
                disabled={loading}
                placeholder="1234 Elm St, Sacramento, CA 95819"
                
                className={`mt-2 block w-full rounded-lg border px-5 py-3 text-lg text-gray-900 shadow-sm outline-none transition focus:ring-2 focus:ring-black ${
                  errors.address
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-400 focus:border-black"
                }`}
              />
              
              <div style={{ minHeight: "24px", marginTop: "4px" }}>
                <p
                  role="alert"
                  style={{
                  color: "#dc2626",
                  fontSize: "13px",
                  fontWeight: 500,
                  margin: 0,
                  visibility: touched.address && errors.address ? "visible" : "hidden",
                  }}
                >
                {errors.address || "placeholder"}
                </p>
              </div>
            
            </div>

            {/* Preferred Date */}
            <div>
              <label
                htmlFor="quote-preferred-date"
                className="block text-lg font-medium text-gray-800"
              >
                Preferred Service Date
              </label>
              <input
                id="quote-preferred-date"
                name="preferred_date"
                type="date"
                value={values.preferred_date}
                onChange={onChange}
                disabled={loading}
                className="mt-2 block w-full rounded-lg border border-gray-400 px-5 py-3 text-lg text-gray-900 shadow-sm outline-none transition focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            {/* Time Slot */}
            <div>
              <label
                htmlFor="quote-time-slot"
                className="block text-lg font-medium text-gray-800"
              >
                Preferred Time Slot
              </label>
              <select
                id="quote-time-slot"
                name="preferred_time_slot"
                value={values.preferred_time_slot}
                onChange={onChange}
                disabled={loading}
                className="mt-2 block w-full rounded-lg border border-gray-400 px-5 py-3 text-lg text-gray-900 shadow-sm outline-none transition focus:ring-2 focus:ring-black focus:border-black"
              >
                <option value="">Select a time slot</option>
                <option value="Morning (8 AM - 12 PM)">Morning (8 AM - 12 PM)</option>
                <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                <option value="Evening (4 PM - 6 PM)">Evening (4 PM - 6 PM)</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isDisabled}
              /* box container submit size */
              className={`w-full rounded-lg px-6 py-4 min-h-[52px] text-lg font-semibold transition ${
                isDisabled
                  ? "cursor-not-allowed bg-gray-300 text-gray-700"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {loading ? "Submitting..." : "Submit Quote Request"}
            </button>

            <p className="text-sm text-gray-600">* Required fields</p>
          </form>
        )}
      </main>
    </>
  );
}
