const Payment = require('../models/Payment');
const PDFDocument = require('pdfkit');

// POST /api/admin/payments  — Record a new payment
exports.recordPayment = async (req, res, next) => {
    try {
        const { userId, eventName, amount, method, transactionId, notes, status } = req.body;
        if (!userId || !eventName || !amount)
            return res.status(400).json({ message: 'userId, eventName and amount are required' });

        const payment = await Payment.create({
            userId,
            eventName,
            amount,
            method: method || 'card',
            transactionId: transactionId || '',
            notes: notes || '',
            status: status || 'completed',
        });
        res.status(201).json({ success: true, payment });
    } catch (err) {
        next(err);
    }
};

// PUT /api/admin/payments/:id  — Update payment details
exports.updatePayment = async (req, res, next) => {
    try {
        const { eventName, amount, method, transactionId, notes, status } = req.body;
        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            { eventName, amount, method, transactionId, notes, status },
            { new: true, runValidators: true }
        );
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        res.json({ success: true, payment });
    } catch (err) {
        next(err);
    }
};

// POST /api/admin/payments/:id/refund  — Handle refund
exports.refundPayment = async (req, res, next) => {
    try {
        const { refundReason } = req.body;
        const payment = await Payment.findById(req.params.id);
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        if (payment.status === 'refunded')
            return res.status(400).json({ message: 'Payment already refunded' });

        payment.status = 'refunded';
        payment.refundReason = refundReason || 'Refunded by admin';
        await payment.save();
        res.json({ success: true, payment });
    } catch (err) {
        next(err);
    }
};

// GET /api/admin/payments/:id/receipt  — Generate PDF receipt
exports.generateReceipt = async (req, res, next) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('userId', 'name email');
        if (!payment) return res.status(404).json({ message: 'Payment not found' });

        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=receipt-${payment._id}.pdf`);
        doc.pipe(res);

        // Header
        doc.fontSize(22).font('Helvetica-Bold').text('PAYMENT RECEIPT', { align: 'center' });
        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(1);

        // Details
        const line = (label, value) => {
            doc.fontSize(12).font('Helvetica-Bold').text(`${label}: `, { continued: true });
            doc.font('Helvetica').text(value);
        };

        line('Receipt ID', payment._id.toString());
        line('Date', new Date(payment.createdAt).toLocaleString());
        line('Attendee', payment.userId?.name || 'N/A');
        line('Email', payment.userId?.email || 'N/A');
        line('Event', payment.eventName);
        line('Amount', `Rs. ${payment.amount.toFixed(2)}`);
        line('Payment Method', payment.method.toUpperCase());
        line('Transaction ID', payment.transactionId || 'N/A');
        line('Status', payment.status.toUpperCase());

        if (payment.status === 'refunded') {
            line('Refund Reason', payment.refundReason);
        }

        doc.moveDown(2);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(1);
        doc.fontSize(10).font('Helvetica').fillColor('gray').text('Thank you for your payment. This is a system-generated receipt.', { align: 'center' });

        doc.end();

        // Mark receipt generated
        payment.receiptGeneratedAt = new Date();
        await payment.save();
    } catch (err) {
        next(err);
    }
};

// GET /api/admin/payments  — List all payments
exports.getAllPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.json({ success: true, payments });
    } catch (err) {
        next(err);
    }
};
