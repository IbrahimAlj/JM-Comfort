import { useState } from "react";
import { trackEvent } from "../utils/analytics";

const initial = { name: "", email: "", phone: "", scheduled_date: "", message: "" };

export default function ContactForm() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = (v) => {
    const e = {};
    if (!v.name.trim()) e.name = "Name is required.";
    if (!v.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Enter a valid email.";
    if (v.phone.trim() && !/^[0-9+\-() ]{7,20}$/.test(v.phone)) e.phone = "Invalid phone.";
    if (!v.message.trim()) e.message = "Message is required.";
    return e;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(validate({ ...values, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = validate(values);
    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      setSending(true);
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_type: "contact",
          name: values.name,
          email: values.email,
          phone: values.phone || undefined,
          preferred_date: values.scheduled_date || undefined,
          message: values.message,
          source: "contact_form",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrors({ submit: data.error || "Failed to send message. Please try again." });
        return;
      }

      trackEvent("contact_form_submit", { form_name: "contact_us" });
      setSent(true);
      setValues(initial);
    } catch (err) {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setSending(false);
    }
  };

  const disabled = sending || Object.keys(validate(values)).length > 0;

  const inputBase =
    "block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900";

  return (
    <div className="w-full px-4 py-4 sm:px-6 sm:py-5">
      {sent && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Thanks — your message has been submitted. We'll follow up within one business day.
        </div>
      )}

      {errors.submit && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.submit}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name<span className="text-red-600">*</span>
          </label>
          <input
            id="name"
            name="name"
            value={values.name}
            onChange={onChange}
            className={`${inputBase} ${errors.name ? "border-red-400" : "border-gray-300"}`}
            placeholder="Jane Doe"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email<span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={onChange}
            className={`${inputBase} ${errors.email ? "border-red-400" : "border-gray-300"}`}
            placeholder="jane@example.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone (optional)
          </label>
          <input
            id="phone"
            name="phone"
            value={values.phone}
            onChange={onChange}
            className={`${inputBase} ${errors.phone ? "border-red-400" : "border-gray-300"}`}
            placeholder="(555) 123-4567"
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="scheduled_date" className="block text-sm font-medium mb-1">
            Preferred Date
          </label>
          <input
            id="scheduled_date"
            name="scheduled_date"
            type="date"
            value={values.scheduled_date}
            onChange={onChange}
            className={`${inputBase} border-gray-300`}
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message<span className="text-red-600">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={values.message}
            onChange={onChange}
            className={`${inputBase} ${errors.message ? "border-red-400" : "border-gray-300"}`}
            placeholder="How can we help?"
          />
          {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
        </div>

        <button
          type="submit"
          disabled={disabled}
          className={`inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition-colors ${
            disabled
              ? "cursor-not-allowed bg-gray-200 text-gray-500"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
        >
          {sending ? "Sending..." : "Send message"}
        </button>

        <p className="text-xs text-gray-500">* Required fields</p>
      </form>
    </div>
  );
}
