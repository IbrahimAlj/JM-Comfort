import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { captureError } from "../utils/captureError";
import PageMeta from "../components/PageMeta";
import {
  quoteInitialValues,
  validateQuote,
  validateQuoteField,
} from "../utils/requestQuoteValidation";

function formatSlotLabel(slot) {
  const [y, m, d] = slot.slot_date.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const datePart = dt.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const fmtTime = (t) => {
    const [hh, mm] = String(t).split(":");
    const h = Number(hh);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${mm} ${ampm}`;
  };
  return `${datePart} — ${fmtTime(slot.start_time)} to ${fmtTime(slot.end_time)}`;
}

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
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [slotsError, setSlotsError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/availability")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to load time slots"))))
      .then((data) => {
        if (!cancelled) setSlots(Array.isArray(data.slots) ? data.slots : []);
      })
      .catch((err) => {
        if (!cancelled) setSlotsError(err.message || "Could not load time slots");
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
          zip: values.zip.trim(),
          lead_type: "quote",
          service_type: preselectedService || undefined,
          availability_slot_id: values.availability_slot_id
            ? Number(values.availability_slot_id)
            : undefined,
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

  const hasEmptyRequired = ["name", "email", "phone", "address", "zip"].some(
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
                placeholder="1234 Elm St, Sacramento, CA"
                
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

            {/* ZIP Code */}
            <div>
              <label
                htmlFor="quote-zip"
                className="block text-lg font-medium text-gray-800"
              >
                ZIP Code <span className="text-red-600">*</span>
              </label>
              <input
                id="quote-zip"
                name="zip"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                value={values.zip}
                onChange={onChange}
                onBlur={onBlur}
                disabled={loading}
                maxLength={10}
                placeholder="95819"
                className={`mt-2 block w-full rounded-lg border px-5 py-3 text-lg text-gray-900 shadow-sm outline-none transition focus:ring-2 focus:ring-black ${
                  errors.zip
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
                    visibility: touched.zip && errors.zip ? "visible" : "hidden",
                  }}
                >
                  {errors.zip || "placeholder"}
                </p>
              </div>
            </div>

            {/* Availability slot */}
            <div>
              <label
                htmlFor="quote-availability-slot"
                className="block text-lg font-medium text-gray-800"
              >
                Preferred Appointment Slot
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Pick a time that works for you. We'll confirm by email.
              </p>

              {slotsLoading ? (
                <p className="mt-2 text-sm text-gray-500">Loading available times...</p>
              ) : slotsError ? (
                <p className="mt-2 text-sm text-red-600">{slotsError}</p>
              ) : slots.length === 0 ? (
                <p className="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  No slots are currently open. Submit your request anyway and we'll reach out
                  to schedule.
                </p>
              ) : (
                <select
                  id="quote-availability-slot"
                  name="availability_slot_id"
                  value={values.availability_slot_id}
                  onChange={onChange}
                  disabled={loading}
                  className="mt-2 block w-full rounded-lg border border-gray-400 px-5 py-3 text-lg text-gray-900 shadow-sm outline-none transition focus:ring-2 focus:ring-black focus:border-black"
                >
                  <option value="">No preference — we'll call to schedule</option>
                  {slots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {formatSlotLabel(slot)}
                      {slot.capacity - slot.booked_count <= 2
                        ? ` · ${slot.capacity - slot.booked_count} left`
                        : ""}
                    </option>
                  ))}
                </select>
              )}
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
