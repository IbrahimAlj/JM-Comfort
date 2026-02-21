const db = require('../config/database');

exports.getAllProjects = async (req, res) => {
  try {
    const [projects] = await db.query(`
      SELECT
        p.*,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name
      FROM projects p
      JOIN customers c ON p.customer_id = c.id
      ORDER BY p.created_at DESC
    `);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const [projects] = await db.query(`
      SELECT
        p.*,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name
      FROM projects p
      JOIN customers c ON p.customer_id = c.id
      WHERE p.id = ?
    `, [id]);

    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(projects[0]);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { customer_id, name, status, start_date, end_date } = req.body;

    if (!customer_id || !name) {
      return res.status(400).json({ error: 'customer_id and name are required' });
    }

    const validStatuses = ['planned', 'in_progress', 'completed', 'cancelled'];
    const projectStatus = status || 'planned';
    if (!validStatuses.includes(projectStatus)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const [result] = await db.query(
      'INSERT INTO projects (customer_id, name, status, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
      [customer_id, name.trim(), projectStatus, start_date || null, end_date || null]
    );

    const [created] = await db.query(`
      SELECT
        p.*,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name
      FROM projects p
      JOIN customers c ON p.customer_id = c.id
      WHERE p.id = ?
    `, [result.insertId]);

    res.status(201).json({ message: 'Project created', project: created[0] });
  } catch (error) {
    console.error('Error creating project:', error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Customer not found' });
    }
    res.status(500).json({ error: 'Failed to create project' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, start_date, end_date } = req.body;

    const [existing] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const validStatuses = ['planned', 'in_progress', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updatedName = name !== undefined ? name.trim() : existing[0].name;
    const updatedStatus = status || existing[0].status;
    const updatedStart = start_date !== undefined ? (start_date || null) : existing[0].start_date;
    const updatedEnd = end_date !== undefined ? (end_date || null) : existing[0].end_date;

    await db.query(
      'UPDATE projects SET name = ?, status = ?, start_date = ?, end_date = ? WHERE id = ?',
      [updatedName, updatedStatus, updatedStart, updatedEnd, id]
    );

    const [updated] = await db.query(`
      SELECT
        p.*,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name
      FROM projects p
      JOIN customers c ON p.customer_id = c.id
      WHERE p.id = ?
    `, [id]);

    res.json({ message: 'Project updated', project: updated[0] });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const [result] = await db.query('DELETE FROM projects WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(500).json({ error: 'Failed to delete project' });
    }

    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ error: 'Cannot delete project with linked appointments or reviews' });
    }
    res.status(500).json({ error: 'Failed to delete project' });
  }
};
