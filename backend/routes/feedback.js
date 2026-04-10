const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/feedbackController');

// Submit & get own feedback (user only)
router.post('/', authenticate, authorize('user'), ctrl.submitFeedback);
router.get('/', authenticate, authorize('user'), ctrl.getMyFeedbacks);
router.put('/mine/:id', authenticate, authorize('user'), ctrl.updateMyFeedback);
router.delete('/mine/:id', authenticate, authorize('user'), ctrl.deleteMyFeedback);

// Admin can view all feedback
router.get('/all', authenticate, authorize('admin'), ctrl.getAllFeedbacks);

// Admin can delete feedback
router.delete('/:id', authenticate, authorize('admin'), ctrl.deleteFeedback);

module.exports = router;
