const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/adminPaymentController');

// All routes require admin role
router.use(authenticate, authorize('admin'));

router.get('/payments', ctrl.getAllPayments);
router.post('/payments', ctrl.recordPayment);
router.put('/payments/:id', ctrl.updatePayment);
router.post('/payments/:id/refund', ctrl.refundPayment);
router.get('/payments/:id/receipt', ctrl.generateReceipt);

module.exports = router;
