const pool = require('../config/database');
const { validationResult } = require('express-validator');

function sendValidationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  return null;
}

exports.getAllServices = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM services WHERE is_active = TRUE ORDER BY id DESC'
    );
    return res.json(rows);
  } catch (err) {
    console.error('getAllServices error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.createService = async (req, res) => {
  const validationResponse = sendValidationErrors(req, res);
  if (validationResponse) return;

  try {
    const {
      name,
      slug,
      short_description = null,
      full_description = null,
      price_starting = null,
      price_description = null,
      image_url = null,
    } = req.body;

    // Prevent duplicate slug (meaningful error)
    const [existing] = await pool.query('SELECT id FROM services WHERE slug = ?', [slug]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'slug already exists' });
    }

    const [result] = await pool.query(
      `INSERT INTO services
       (name, slug, short_description, full_description, price_starting, price_description, image_url, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [name, slug, short_description, full_description, price_starting, price_description, image_url]
    );

    return res.status(201).json({
      message: 'Service created',
      id: result.insertId,
    });
  } catch (err) {
    console.error('createService error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.updateService = async (req, res) => {
  const validationResponse = sendValidationErrors(req, res);
  if (validationResponse) return;

  try {
    const id = Number(req.params.id);

    // Ensure service exists
    const [existing] = await pool.query('SELECT id FROM services WHERE id = ? AND is_active = TRUE', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const allowed = [
      'name',
      'slug',
      'short_description',
      'full_description',
      'price_starting',
      'price_description',
      'image_url',
      'is_active',
    ];

    const updates = [];
    const values = [];

    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updates.push(`${key} = ?`);
        values.push(req.body[key]);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No valid fields provided to update' });
    }

    // If slug is being updated, prevent duplicates
    if (Object.prototype.hasOwnProperty.call(req.body, 'slug')) {
      const [dup] = await pool.query('SELECT id FROM services WHERE slug = ? AND id <> ?', [
        req.body.slug,
        id,
      ]);
      if (dup.length > 0) {
        return res.status(409).json({ message: 'slug already exists' });
      }
    }

    values.push(id);
    await pool.query(`UPDATE services SET ${updates.join(', ')} WHERE id = ?`, values);

    return res.json({ message: 'Service updated' });
  } catch (err) {
    console.error('updateService error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteService = async (req, res) => {
  const validationResponse = sendValidationErrors(req, res);
  if (validationResponse) return;

  try {
    const id = Number(req.params.id);

    const [existing] = await pool.query('SELECT id FROM services WHERE id = ? AND is_active = TRUE', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Soft delete so you don’t lose data
    await pool.query('UPDATE services SET is_active = FALSE WHERE id = ?', [id]);

    return res.json({ message: 'Service deleted' });
  } catch (err) {
    console.error('deleteService error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};