const db = require('../config/database');

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const [appointments] = await db.query(`
      SELECT 
        a.*,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name,
        c.email as customer_email,
        c.phone as customer_phone,
        p.name as project_name
      FROM appointments a
      JOIN customers c ON a.customer_id = c.id
      LEFT JOIN projects p ON a.project_id = p.id
      ORDER BY a.scheduled_at DESC
    `);
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

// Get appointments by status
exports.getAppointmentsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'scheduled', 'completed', 'cancelled', 'no_show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const [appointments] = await db.query(`
      SELECT 
        a.*,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name,
        c.email as customer_email,
        c.phone as customer_phone,
        p.name as project_name
      FROM appointments a
      JOIN customers c ON a.customer_id = c.id
      LEFT JOIN projects p ON a.project_id = p.id
      WHERE a.status = ?
      ORDER BY a.scheduled_at DESC
    `, [status]);
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

// Approve appointment
exports.approveAppointment = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;
    const { approved_by } = req.body;
    
    // Validation
    if (!id) {
      return res.status(400).json({ error: 'Appointment ID is required' });
    }
    
    // Check if appointment exists
    const [appointments] = await connection.query(
      'SELECT * FROM appointments WHERE id = ?',
      [id]
    );
    
    if (appointments.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    const appointment = appointments[0];
    
    // Check if appointment is in pending status
    if (appointment.status !== 'pending') {
      await connection.rollback();
      return res.status(400).json({ 
        error: `Cannot approve appointment with status: ${appointment.status}` 
      });
    }
    
    // Update appointment status to approved
    const [result] = await connection.query(`
      UPDATE appointments 
      SET status = 'approved',
          approved_by = ?,
          approved_at = CURRENT_TIMESTAMP,
          rejection_reason = NULL
      WHERE id = ?
    `, [approved_by || null, id]);
    
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(500).json({ error: 'Failed to approve appointment' });
    }
    
    // Fetch updated appointment
    const [updatedAppointment] = await connection.query(`
      SELECT 
        a.*,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name,
        c.email as customer_email
      FROM appointments a
      JOIN customers c ON a.customer_id = c.id
      WHERE a.id = ?
    `, [id]);
    
    await connection.commit();
    
    res.json({
      message: 'Appointment approved successfully',
      appointment: updatedAppointment[0]
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Error approving appointment:', error);
    res.status(500).json({ error: 'Failed to approve appointment' });
  } finally {
    connection.release();
  }
};

// Reject appointment
exports.rejectAppointment = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;
    const { approved_by, rejection_reason } = req.body;
    
    // Validation
    if (!id) {
      return res.status(400).json({ error: 'Appointment ID is required' });
    }
    
    if (!rejection_reason || rejection_reason.trim().length === 0) {
      return res.status(400).json({ error: 'Rejection reason is required' });
    }
    
    // Check if appointment exists
    const [appointments] = await connection.query(
      'SELECT * FROM appointments WHERE id = ?',
      [id]
    );
    
    if (appointments.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    const appointment = appointments[0];
    
    // Check if appointment is in pending status
    if (appointment.status !== 'pending') {
      await connection.rollback();
      return res.status(400).json({ 
        error: `Cannot reject appointment with status: ${appointment.status}` 
      });
    }
    
    // Update appointment status to rejected
    const [result] = await connection.query(`
      UPDATE appointments 
      SET status = 'rejected',
          approved_by = ?,
          approved_at = CURRENT_TIMESTAMP,
          rejection_reason = ?
      WHERE id = ?
    `, [approved_by || null, rejection_reason.trim(), id]);
    
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(500).json({ error: 'Failed to reject appointment' });
    }
    
    // Fetch updated appointment
    const [updatedAppointment] = await connection.query(`
      SELECT 
        a.*,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name,
        c.email as customer_email
      FROM appointments a
      JOIN customers c ON a.customer_id = c.id
      WHERE a.id = ?
    `, [id]);
    
    await connection.commit();
    
    res.json({
      message: 'Appointment rejected successfully',
      appointment: updatedAppointment[0]
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Error rejecting appointment:', error);
    res.status(500).json({ error: 'Failed to reject appointment' });
  } finally {
    connection.release();
  }
};

// Update appointment status (general)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'scheduled', 'completed', 'cancelled', 'no_show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const [result] = await db.query(
      'UPDATE appointments SET status = ? WHERE id = ?',
      [status, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    res.json({ message: 'Appointment status updated successfully' });
    
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ error: 'Failed to update appointment status' });
  }
};
