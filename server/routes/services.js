const express = require('express');
const { body, param } = require('express-validator');
const servicesController = require('../controllers/servicesController');

const router = express.Router();

// GET all services
router.get('/', servicesController.getAllServices);

// GET service by id, for service details 
router.get(
  '/:id',
  // assuming that the ID is an INT otherwise change param('id').isInt()
  [ param('id').isInt().withMessage('ID must be number') ], 

  servicesController.getServiceById
);

// CREATE service (validation)
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('name is required'),
    body('slug').trim().notEmpty().withMessage('slug is required'),
    body('price_starting')
      .optional({ nullable: true })
      .isFloat({ min: 0 })
      .withMessage('price_starting must be a number >= 0'),
  ],
  servicesController.createService
);

// UPDATE service (validation)
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('id must be an integer'),
    body('name').optional().trim().notEmpty().withMessage('name cannot be empty'),
    body('slug').optional().trim().notEmpty().withMessage('slug cannot be empty'),
    body('price_starting')
      .optional({ nullable: true })
      .isFloat({ min: 0 })
      .withMessage('price_starting must be a number >= 0'),
  ],
  servicesController.updateService
);

// DELETE service (soft delete)
router.delete(
  '/:id',
  [param('id').isInt().withMessage('id must be an integer')],
  servicesController.deleteService
);

module.exports = router;
