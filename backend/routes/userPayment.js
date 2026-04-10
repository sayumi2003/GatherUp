const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/userPaymentController');

// All routes require user role
router.use(authenticate, authorize('user'));

router.post('/payments', ctrl.makePayment);
router.get('/payments', ctrl.getMyPayments);
router.get('/payments/:id/receipt', ctrl.getMyReceipt);
router.get('/profile', ctrl.getProfile);
router.post('/cards', ctrl.addCard);

module.exports = router;
