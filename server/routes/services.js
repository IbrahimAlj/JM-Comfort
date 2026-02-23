const express = require('express');
const { body, param } = require('express-validator');
const servicesController = require('../controllers/servicesController');

const router = express.Router();

// GET all services
router.get('/', servicesController.getAllServices);

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
const router = express.Router();
const serviceController = require('../controllers/serviceController');

router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.post('/', serviceController.createService);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;
