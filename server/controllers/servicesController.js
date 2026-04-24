const pool = require('../config/database');
const { validationResult } = require('express-validator');
const { s3Client, DeleteObjectCommand, BUCKET_NAME } = require('../config/s3');

function sendValidationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  return null;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function formatPriceLabel(row) {
  if (row.price_description) return row.price_description;
  if (row.price_starting != null) return `Starting at $${Number(row.price_starting).toFixed(2)}`;
  return null;
}

function toServiceResponse(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    title: row.name,
    slug: row.slug,
    short_description: row.short_description,
    full_description: row.full_description,
    description: row.full_description || row.short_description || '',
    price_starting: row.price_starting,
    price_description: row.price_description,
    price: formatPriceLabel(row),
    image_url: row.image_url,
    image: row.image_url,
    is_active: !!row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function extractS3KeyFromUrl(url) {
  if (!url || !BUCKET_NAME) return null;
  const host = `${BUCKET_NAME}.s3.`;
  const idx = url.indexOf(host);
  if (idx === -1) return null;
  const afterHost = url.slice(idx + host.length);
  const slashIdx = afterHost.indexOf('/');
  if (slashIdx === -1) return null;
  return afterHost.slice(slashIdx + 1);
}

async function deleteS3Object(s3Url) {
  const key = extractS3KeyFromUrl(s3Url);
  if (!key) return;
  try {
    await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
  } catch (err) {
    console.error('[services] Failed to delete S3 object:', err.message);
  }
}

exports.getAllServices = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, slug, short_description, full_description,
              price_starting, price_description, image_url, is_active,
              created_at, updated_at
       FROM services
       WHERE is_active = TRUE
       ORDER BY id ASC`
    );
    return res.json(rows.map(toServiceResponse));
  } catch (err) {
    console.error('getAllServices error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getServiceById = async (req, res) => {
  const validationResponse = sendValidationErrors(req, res);
  if (validationResponse) return;

  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const [rows] = await pool.query(
      `SELECT id, name, slug, short_description, full_description,
              price_starting, price_description, image_url, is_active,
              created_at, updated_at
       FROM services WHERE id = ? LIMIT 1`,
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    return res.json(toServiceResponse(rows[0]));
  } catch (err) {
    console.error('getServiceById error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

function readBody(req) {
  const body = req.body || {};
  const name = (body.name ?? body.title ?? '').toString().trim();
  const shortDescription =
    body.short_description != null ? String(body.short_description).trim() : null;
  const fullDescription = (body.full_description ?? body.description ?? '').toString().trim();
  const priceStartingRaw =
    body.price_starting != null && String(body.price_starting).trim() !== ''
      ? Number(body.price_starting)
      : null;
  const priceDescription =
    body.price_description != null
      ? String(body.price_description).trim() || null
      : body.price != null
        ? String(body.price).trim() || null
        : null;
  const slug = body.slug ? slugify(body.slug) : name ? slugify(name) : '';
  return {
    name,
    slug,
    shortDescription,
    fullDescription,
    priceStarting: Number.isFinite(priceStartingRaw) ? priceStartingRaw : null,
    priceDescription,
  };
}

exports.createService = async (req, res) => {
  const validationResponse = sendValidationErrors(req, res);
  if (validationResponse) return;

  try {
    const parsed = readBody(req);
    if (!parsed.name) {
      return res.status(400).json({ error: 'Validation failed', details: ['name is required'] });
    }
    if (!parsed.fullDescription) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: ['description is required'] });
    }
    if (!parsed.slug) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: ['slug could not be derived from name'] });
    }

    const [dup] = await pool.query('SELECT id FROM services WHERE slug = ?', [parsed.slug]);
    if (dup.length > 0) {
      return res.status(409).json({ error: 'slug already exists' });
    }

    const imageUrl = req.uploadedImageUrl || (req.body.image_url ? String(req.body.image_url) : null);

    const [result] = await pool.query(
      `INSERT INTO services
         (name, slug, short_description, full_description, price_starting, price_description, image_url, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [
        parsed.name,
        parsed.slug,
        parsed.shortDescription,
        parsed.fullDescription,
        parsed.priceStarting,
        parsed.priceDescription,
        imageUrl,
      ]
    );

    const [rows] = await pool.query(
      `SELECT id, name, slug, short_description, full_description,
              price_starting, price_description, image_url, is_active,
              created_at, updated_at
       FROM services WHERE id = ?`,
      [result.insertId]
    );

    return res.status(201).json({ message: 'Service created', service: toServiceResponse(rows[0]) });
  } catch (err) {
    console.error('createService error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.updateService = async (req, res) => {
  const validationResponse = sendValidationErrors(req, res);
  if (validationResponse) return;

  try {
    const id = Number(req.params.id);

    const [existingRows] = await pool.query(
      `SELECT id, image_url FROM services WHERE id = ?`,
      [id]
    );
    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const body = req.body || {};
    const updates = [];
    const values = [];

    const has = (k) => Object.prototype.hasOwnProperty.call(body, k);

    if (has('name') || has('title')) {
      const name = (body.name ?? body.title).toString().trim();
      if (!name) {
        return res.status(400).json({ error: 'Validation failed', details: ['name cannot be empty'] });
      }
      updates.push('name = ?');
      values.push(name);

      if (!has('slug')) {
        const autoSlug = slugify(name);
        const [dup] = await pool.query(
          'SELECT id FROM services WHERE slug = ? AND id <> ?',
          [autoSlug, id]
        );
        if (dup.length === 0) {
          updates.push('slug = ?');
          values.push(autoSlug);
        }
      }
    }

    if (has('slug')) {
      const slug = slugify(body.slug);
      if (!slug) {
        return res.status(400).json({ error: 'Validation failed', details: ['slug cannot be empty'] });
      }
      const [dup] = await pool.query(
        'SELECT id FROM services WHERE slug = ? AND id <> ?',
        [slug, id]
      );
      if (dup.length > 0) {
        return res.status(409).json({ error: 'slug already exists' });
      }
      updates.push('slug = ?');
      values.push(slug);
    }

    if (has('short_description')) {
      updates.push('short_description = ?');
      const v = body.short_description;
      values.push(v == null || String(v).trim() === '' ? null : String(v).trim());
    }

    if (has('full_description') || has('description')) {
      const v = (body.full_description ?? body.description).toString().trim();
      if (!v) {
        return res
          .status(400)
          .json({ error: 'Validation failed', details: ['description cannot be empty'] });
      }
      updates.push('full_description = ?');
      values.push(v);
    }

    if (has('price_starting')) {
      const raw = body.price_starting;
      const num = raw == null || String(raw).trim() === '' ? null : Number(raw);
      updates.push('price_starting = ?');
      values.push(Number.isFinite(num) ? num : null);
    }

    if (has('price_description') || has('price')) {
      const v = (body.price_description ?? body.price);
      updates.push('price_description = ?');
      values.push(v == null || String(v).trim() === '' ? null : String(v).trim());
    }

    if (has('is_active')) {
      updates.push('is_active = ?');
      const v = body.is_active;
      values.push(v === true || v === 'true' || v === 1 || v === '1');
    }

    let oldImageToDelete = null;
    if (req.uploadedImageUrl) {
      updates.push('image_url = ?');
      values.push(req.uploadedImageUrl);
      oldImageToDelete = existingRows[0].image_url;
    } else if (has('image_url')) {
      const newUrl = body.image_url ? String(body.image_url) : null;
      updates.push('image_url = ?');
      values.push(newUrl);
      if (newUrl !== existingRows[0].image_url) {
        oldImageToDelete = existingRows[0].image_url;
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields provided to update' });
    }

    values.push(id);
    await pool.query(`UPDATE services SET ${updates.join(', ')} WHERE id = ?`, values);

    if (oldImageToDelete) {
      const isS3Url = extractS3KeyFromUrl(oldImageToDelete) !== null;
      if (isS3Url) await deleteS3Object(oldImageToDelete);
    }

    const [rows] = await pool.query(
      `SELECT id, name, slug, short_description, full_description,
              price_starting, price_description, image_url, is_active,
              created_at, updated_at
       FROM services WHERE id = ?`,
      [id]
    );

    return res.json({ message: 'Service updated', service: toServiceResponse(rows[0]) });
  } catch (err) {
    console.error('updateService error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteService = async (req, res) => {
  const validationResponse = sendValidationErrors(req, res);
  if (validationResponse) return;

  try {
    const id = Number(req.params.id);

    const [existing] = await pool.query('SELECT id, image_url FROM services WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    await pool.query('UPDATE services SET is_active = FALSE WHERE id = ?', [id]);

    return res.json({ message: 'Service deleted' });
  } catch (err) {
    console.error('deleteService error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
