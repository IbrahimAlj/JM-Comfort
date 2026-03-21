const pool = require('../config/db');

/**
 * POST /api/feedback
 * Store a UAT feedback submission.
 */
exports.createFeedback = async (req, res) => {
  try {
    const feedbackText = (req.body.feedback_text ?? '').toString().trim();

    if (!feedbackText) {
      return res.status(400).json({ error: 'Feedback text is required.' });
    }

    if (feedbackText.length > 5000) {
      return res.status(400).json({ error: 'Feedback must be 5000 characters or fewer.' });
    }

    const [result] = await pool.execute(
      'INSERT INTO uat_feedback (feedback_text) VALUES (?)',
      [feedbackText]
    );

    return res.status(201).json({
      message: 'Feedback submitted successfully.',
      feedback_id: result.insertId,
    });
  } catch (err) {
    console.error('[feedback] Failed to create feedback:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
