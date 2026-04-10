const Payment = require('../models/Payment');
const User = require('../models/User');
const PDFDocument = require('pdfkit');

// POST /api/user/payments  — Make a payment
exports.makePayment = async (req, res, next) => {
    try {
        const { eventName, amount, method, transactionId } = req.body;
        if (!eventName || !amount)
            return res.status(400).json({ message: 'eventName and amount are required' });

        const payment = await Payment.create({
            userId: req.user.id,
            eventName,
            amount,
            method: method || 'card',
            transactionId: transactionId || `TXN-${Date.now()}`,
            status: 'completed',
        });
        res.status(201).json({ success: true, payment });
    } catch (err) {
        next(err);
    }
};

// GET /api/user/payments  — View payment history
exports.getMyPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, payments });
    } catch (err) {
        next(err);
    }
};

// GET /api/user/payments/:id/receipt  — Download receipt for own payment
exports.getMyReceipt = async (req, res, next) => {
    try {
        const payment = await Payment.findOne({ _id: req.params.id, userId: req.user.id });
        if (!payment) return res.status(404).json({ message: 'Payment not found' });

        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=receipt-${payment._id}.pdf`);
        doc.pipe(res);

        doc.fontSize(22).font('Helvetica-Bold').text('PAYMENT RECEIPT', { align: 'center' });
        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(1);

        const line = (label, value) => {
            doc.fontSize(12).font('Helvetica-Bold').text(`${label}: `, { continued: true });
            doc.font('Helvetica').text(value);
        };

        line('Receipt ID', payment._id.toString());
        line('Date', new Date(payment.createdAt).toLocaleString());
        line('Event', payment.eventName);
        line('Amount', `Rs. ${payment.amount.toFixed(2)}`);
        line('Payment Method', payment.method.toUpperCase());
        line('Transaction ID', payment.transactionId || 'N/A');
        line('Status', payment.status.toUpperCase());

        doc.moveDown(2);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(1);
        doc.fontSize(10).font('Helvetica').fillColor('gray').text('Thank you for your payment. This is a system-generated receipt.', { align: 'center' });
        doc.end();

        payment.receiptGeneratedAt = new Date();
        await payment.save();
    } catch (err) {
        next(err);
    }
};

// GET /api/user/profile
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-passwordHash');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

// POST /api/user/cards
exports.addCard = async (req, res, next) => {
    try {
        const { cardName, cardNumber, expiry, cvv } = req.body;
        if (!cardNumber || !expiry || !cvv) {
            return res.status(400).json({ message: 'Card number, expiry, and CVV are required' });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.savedCards.push({ cardName: cardName || 'My Card', cardNumber, expiry, cvv });
        await user.save();

        res.status(201).json({ success: true, cards: user.savedCards });
    } catch (err) {
        next(err);
    }
};
