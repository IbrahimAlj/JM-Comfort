import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';

const INITIAL = { feedback_text: '' };

export default function UATFeedbackForm() {
  const [values, setValues] = useState(INITIAL);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (v) => {
    if (!v.feedback_text.trim()) return 'Feedback is required.';
    if (v.feedback_text.trim().length > 5000) return 'Feedback must be 5000 characters or fewer.';
    return '';
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (error) setError(validate({ ...values, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback_text: values.feedback_text.trim() }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setSubmitted(true);
      setValues(INITIAL);
    } catch {
      setError('Unable to submit feedback. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const charCount = values.feedback_text.length;
  const isDisabled = submitting || !values.feedback_text.trim();

  if (submitted) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-green-800 mb-2">Thank You</h2>
          <p className="text-green-700 text-base">Your feedback has been submitted. We appreciate your input.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-6 rounded-xl border border-green-600 px-5 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-100 transition-colors"
          >
            Submit another response
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full max-w-2xl mx-auto rounded-2xl border border-gray-200 bg-white p-8 shadow-sm overflow-hidden">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">UAT Feedback</h2>
      <p className="text-gray-500 text-sm mb-7">
        Use this form to share your comments and observations while testing the JM Comfort website.
      </p>

      <form onSubmit={onSubmit} noValidate className="w-full space-y-5">
        <div className="w-full">
          <label htmlFor="feedback_text" className="block text-base font-semibold text-gray-800 mb-2">
            Your Feedback:
          </label>
          <textarea
            id="feedback_text"
            name="feedback_text"
            rows={5}
            value={values.feedback_text}
            onChange={onChange}
            disabled={submitting}
            placeholder="Describe what you observed, any issues you encountered, or suggestions for improvement."
            className={`w-full max-w-full rounded-xl border px-4 py-3 text-xl outline-none focus:ring-2 focus:ring-indigo-400 resize-vertical disabled:bg-gray-50 disabled:cursor-not-allowed transition ${
              error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
            }`}
          />
          <div className="flex justify-between mt-2">
            {error ? (
              <p className="text-sm font-medium text-red-600">{error}</p>
            ) : (
              <span />
            )}
            <p className={`text-xs ml-auto ${charCount > 5000 ? 'text-red-600 font-semibold' : 'text-gray-400'}`}>
              {charCount} / 5000
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className={`w-full rounded-xl px-4 py-3 font-semibold text-base transition-all ${
            isDisabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-md hover:shadow-lg'
          }`}
        >
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>

      </form>
    </section>
  );
}
