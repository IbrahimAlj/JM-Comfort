const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

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

module.exports = router;
