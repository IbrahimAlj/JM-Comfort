const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const requireAdmin = require('../middleware/requireAdmin');

// Public routes
router.get('/', reviewController.getPublishedReviews);
router.get('/featured', reviewController.getFeaturedReviews);
router.post('/', reviewController.submitReview);

// Admin routes
router.get('/admin', requireAdmin, reviewController.getAllReviews);
router.patch('/:id/publish', requireAdmin, reviewController.publishReview);
router.patch('/:id/unpublish', requireAdmin, reviewController.unpublishReview);
router.patch('/:id/feature', requireAdmin, reviewController.featureReview);
router.patch('/:id/unfeature', requireAdmin, reviewController.unfeatureReview);
router.delete('/:id', requireAdmin, reviewController.deleteReview);

module.exports = router;
