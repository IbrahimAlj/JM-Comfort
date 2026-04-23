const pool = require('../config/db');

// Get published reviews (public)
exports.getPublishedReviews = async (req, res) => {
  try {
    const [reviews] = await pool.execute(`
      SELECT r.id, r.rating, r.comment, r.created_at,
        COALESCE(r.reviewer_name, CONCAT(c.first_name, ' ', c.last_name)) as name
      FROM reviews r
      LEFT JOIN customers c ON r.customer_id = c.id
      WHERE r.published = TRUE
      ORDER BY r.created_at DESC
    `);
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Submit a review (public)
exports.submitReview = async (req, res) => {
  const { name, email, rating, comment } = req.body;
  const errors = [];

  if (!name || !String(name).trim()) errors.push('name is required');
  if (!email || !String(email).trim()) errors.push('email is required');
  if (rating === undefined || rating === null || rating === '') {
    errors.push('rating is required');
  } else if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
    errors.push('rating must be between 1 and 5');
  }
  if (!comment || !String(comment).trim()) errors.push('comment is required');

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO reviews (reviewer_name, reviewer_email, rating, comment, published)
       VALUES (?, ?, ?, ?, FALSE)`,
      [String(name).trim(), String(email).trim(), Number(rating), String(comment).trim()]
    );
    res.status(201).json({
      message: 'Review submitted successfully',
      review_id: result.insertId,
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
};

// Get all reviews (admin)
exports.getAllReviews = async (req, res) => {
  try {
    const [reviews] = await pool.execute(`
      SELECT r.id, r.rating, r.comment, r.published, r.created_at,
        COALESCE(r.reviewer_name, CONCAT(c.first_name, ' ', c.last_name)) as name,
        COALESCE(r.reviewer_email, c.email) as email
      FROM reviews r
      LEFT JOIN customers c ON r.customer_id = c.id
      ORDER BY r.created_at DESC
    `);
    res.json({ ok: true, reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Publish a review (admin)
exports.publishReview = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute(
      'UPDATE reviews SET published = TRUE WHERE id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ message: 'Review published successfully' });
  } catch (error) {
    console.error('Error publishing review:', error);
    res.status(500).json({ error: 'Failed to publish review' });
  }
};

// Unpublish a review (admin)
exports.unpublishReview = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute(
      'UPDATE reviews SET published = FALSE WHERE id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ message: 'Review unpublished successfully' });
  } catch (error) {
    console.error('Error unpublishing review:', error);
    res.status(500).json({ error: 'Failed to unpublish review' });
  }
};

// Delete a review (admin)
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute(
      'DELETE FROM reviews WHERE id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};
