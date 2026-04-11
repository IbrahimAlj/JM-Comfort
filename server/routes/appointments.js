const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const pool = require('../config/db');

// Create appointment
router.post('/', async (req, res) => {
  const { customer_id, project_id, scheduled_at, end_at, status, notes } = req.body;

  const errors = [];

  if (!customer_id) {
    errors.push('customer_id is required');
  } else if (!Number.isInteger(Number(customer_id)) || Number(customer_id) <= 0) {
    errors.push('customer_id must be a positive integer');
  }

  if (!scheduled_at) {
    errors.push('scheduled_at is required');
  } else {
    const scheduledDate = new Date(scheduled_at);
    if (isNaN(scheduledDate.getTime())) {
      errors.push('scheduled_at must be a valid datetime');
    } else if (scheduledDate < new Date()) {
      errors.push('scheduled_at must not be in the past');
    }
  }

  if (!end_at) {
    errors.push('end_at is required');
  } else {
    const endDate = new Date(end_at);
    if (isNaN(endDate.getTime())) {
      errors.push('end_at must be a valid datetime');
    } else if (scheduled_at && !isNaN(new Date(scheduled_at).getTime()) && endDate <= new Date(scheduled_at)) {
      errors.push('end_at must be after scheduled_at');
    } else if (scheduled_at && !isNaN(new Date(scheduled_at).getTime())) {
      const durationMs = endDate - new Date(scheduled_at);
      if (durationMs < 15 * 60 * 1000) {
        errors.push('Appointment must be at least 15 minutes long');
      } else if (durationMs > 8 * 60 * 60 * 1000) {
        errors.push('Appointment must not exceed 8 hours');
      }
    }
  }

  const allowedStatuses = ['pending', 'scheduled', 'approved', 'rejected', 'cancelled', 'completed'];
  if (status && !allowedStatuses.includes(status)) {
    errors.push('status must be one of: ' + allowedStatuses.join(', '));
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  try {
    const [overlapping] = await pool.execute(
      `SELECT id FROM appointments
       WHERE customer_id = ?
       AND status NOT IN ('cancelled', 'rejected')
       AND scheduled_at < ? AND end_at > ?`,
      [customer_id, end_at, scheduled_at]
    );

    if (overlapping.length > 0) {
      return res.status(409).json({
        error: 'Scheduling conflict',
        details: 'This appointment overlaps with an existing appointment for this customer',
        conflicting_appointment_id: overlapping[0].id,
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO appointments (customer_id, project_id, scheduled_at, end_at, status, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [customer_id, project_id || null, scheduled_at, end_at, status || 'scheduled', notes || null]
    );

    return res.status(201).json({
      message: 'Appointment created successfully',
      appointment_id: result.insertId,
    });
  } catch (error) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Invalid reference' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all appointments
router.get('/', appointmentController.getAllAppointments);

// Get appointments by status
router.get('/status/:status', appointmentController.getAppointmentsByStatus);

// Approve appointment
router.patch('/:id/approve', appointmentController.approveAppointment);

// Reject appointment
router.patch('/:id/reject', appointmentController.rejectAppointment);

// Update appointment status (general)
router.patch('/:id/status', appointmentController.updateAppointmentStatus);

// Delete appointment
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
