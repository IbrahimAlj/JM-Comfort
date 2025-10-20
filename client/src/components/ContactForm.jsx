import { useState } from "react";

const initial = { name: "", email: "", phone: "", message: "" };

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
      // ---- Placeholder for future backend wiring ----
      await new Promise((r) => setTimeout(r, 500));
      // -----------------------------------------------
      setSent(true);
      setValues(initial);
    } finally {
      setSending(false);
    }
  };

  const disabled = sending || Object.keys(validate(values)).length > 0;

  return (
    <section className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>

      {sent && (
        <div className="mb-4 rounded-lg border p-3 text-sm bg-green-50 border-green-200">
          Thanks! Your message has been submitted.
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name<span className="text-red-600">*</span>
          </label>
          <input
            id="name"
            name="name"
            value={values.name}
            onChange={onChange}
            className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400 ${
              errors.name ? "border-red-400" : "border-gray-300"
            }`}
            placeholder="Jane Doe"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        {/* Email */}
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
            className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400 ${
              errors.email ? "border-red-400" : "border-gray-300"
            }`}
            placeholder="jane@example.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        {/* Phone (optional) */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone (optional)
          </label>
          <input
            id="phone"
            name="phone"
            value={values.phone}
            onChange={onChange}
            className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400 ${
              errors.phone ? "border-red-400" : "border-gray-300"
            }`}
            placeholder="(555) 123-4567"
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>

        {/* Message */}
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
            className={`w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400 ${
              errors.message ? "border-red-400" : "border-gray-300"
            }`}
            placeholder="How can we help?"
          />
          {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
        </div>

        <button
          type="submit"
          disabled={disabled}
          className={`w-full rounded-lg px-4 py-2 font-medium ${
            disabled ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {sending ? "Sending..." : "Send message"}
        </button>

        <p className="text-xs text-gray-500">* Required fields</p>
      </form>
    </section>
  );
}
