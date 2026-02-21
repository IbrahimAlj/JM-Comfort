const db = require('../config/database');

exports.getAllServices = async (req, res) => {
  try {
    const [services] = await db.query(
      'SELECT * FROM services ORDER BY created_at DESC'
    );
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const [services] = await db.query('SELECT * FROM services WHERE id = ?', [id]);

    if (services.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(services[0]);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
};

exports.createService = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Service title is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Service description is required' });
    }

    const [result] = await db.query(
      'INSERT INTO services (title, description, price) VALUES (?, ?, ?)',
      [title.trim(), description.trim(), price ? price.trim() : null]
    );

    const [created] = await db.query('SELECT * FROM services WHERE id = ?', [result.insertId]);

    res.status(201).json({ message: 'Service created', service: created[0] });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price } = req.body;

    const [existing] = await db.query('SELECT * FROM services WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ error: 'Service title cannot be empty' });
    }
    if (description !== undefined && !description.trim()) {
      return res.status(400).json({ error: 'Service description cannot be empty' });
    }

    const updatedTitle = title !== undefined ? title.trim() : existing[0].title;
    const updatedDescription = description !== undefined ? description.trim() : existing[0].description;
    const updatedPrice = price !== undefined ? (price ? price.trim() : null) : existing[0].price;

    await db.query(
      'UPDATE services SET title = ?, description = ?, price = ? WHERE id = ?',
      [updatedTitle, updatedDescription, updatedPrice, id]
    );

    const [updated] = await db.query('SELECT * FROM services WHERE id = ?', [id]);

    res.json({ message: 'Service updated', service: updated[0] });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query('SELECT * FROM services WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const [result] = await db.query('DELETE FROM services WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(500).json({ error: 'Failed to delete service' });
    }

    res.json({ message: 'Service deleted' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
};
