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
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
          <h2 className="text-xl font-semibold text-green-800 mb-2">Thank You</h2>
          <p className="text-green-700">Your feedback has been submitted. We appreciate your input.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 rounded-lg border border-green-600 px-4 py-2 text-sm text-green-700 hover:bg-green-100"
          >
            Submit another response
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-2">UAT Feedback</h2>
      <p className="text-gray-600 text-sm mb-6">
        Use this form to share your comments and observations while testing the JM Comfort website.
      </p>

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="feedback_text" className="block text-sm font-medium mb-1">
            Your Feedback<span className="text-red-600">*</span>
          </label>
          <textarea
            id="feedback_text"
            name="feedback_text"
            rows={6}
            value={values.feedback_text}
            onChange={onChange}
            disabled={submitting}
            placeholder="Describe what you observed, any issues you encountered, or suggestions for improvement."
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 resize-vertical disabled:bg-gray-50 ${
              error ? 'border-red-400' : 'border-gray-400'
            }`}
          />
          <div className="flex justify-between mt-1">
            {error ? (
              <p className="text-xs text-red-600">{error}</p>
            ) : (
              <span />
            )}
            <p className={`text-xs ml-auto ${charCount > 5000 ? 'text-red-600' : 'text-gray-500'}`}>
              {charCount} / 5000
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className={`w-full rounded-lg px-4 py-2 font-medium text-sm transition-colors ${
            isDisabled
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>

        <p className="text-xs text-gray-500">* Required field</p>
      </form>
    </section>
  );
}
