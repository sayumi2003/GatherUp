const Feedback = require('../models/Feedback');
const Payment = require('../models/Payment');

// POST /api/feedback  — Submit feedback (only if completed payment exists)
exports.submitFeedback = async (req, res, next) => {
    try {
        const { paymentId, rating, comment } = req.body;
        if (!paymentId || !rating)
            return res.status(400).json({ message: 'paymentId and rating are required' });

        if (rating < 1 || rating > 5)
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });

        // Gate: user must have a completed payment for this paymentId
        const payment = await Payment.findOne({
            _id: paymentId,
            userId: req.user.id,
            status: 'completed',
        });
        if (!payment)
            return res.status(403).json({ message: 'You can only review events you have completed payments for' });

        // Check duplicate
        const existing = await Feedback.findOne({ userId: req.user.id, paymentId });
        if (existing)
            return res.status(409).json({ message: 'You have already submitted feedback for this payment' });

        const feedback = await Feedback.create({
            userId: req.user.id,
            paymentId,
            rating,
            comment: comment || '',
        });
        res.status(201).json({ success: true, feedback });
    } catch (err) {
        next(err);
    }
};

// GET /api/feedback  — Get my submitted feedbacks
exports.getMyFeedbacks = async (req, res, next) => {
    try {
        const feedbacks = await Feedback.find({ userId: req.user.id })
            .populate('paymentId', 'eventName amount createdAt')
            .sort({ createdAt: -1 });
        res.json({ success: true, feedbacks });
    } catch (err) {
        next(err);
    }
};

// GET /api/feedback/all  — Admin: get all feedbacks
exports.getAllFeedbacks = async (req, res, next) => {
    try {
        const feedbacks = await Feedback.find()
            .populate('userId', 'name email')
            .populate('paymentId', 'eventName amount')
            .sort({ createdAt: -1 });
        res.json({ success: true, feedbacks });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/feedback/:id  — Admin: delete a specific feedback
exports.deleteFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        await feedback.deleteOne();
        res.json({ success: true, message: 'Feedback deleted successfully' });
    } catch (err) {
        next(err);
    }
};

// PUT /api/feedback/mine/:id  — User: update own feedback
exports.updateMyFeedback = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        const feedback = await Feedback.findOne({ _id: req.params.id, userId: req.user.id });
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
        feedback.rating = rating;
        feedback.comment = comment || '';
        await feedback.save();
        res.json({ success: true, feedback });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/feedback/mine/:id  — User: delete own feedback
exports.deleteMyFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedback.findOne({ _id: req.params.id, userId: req.user.id });
        if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
        await feedback.deleteOne();
        res.json({ success: true, message: 'Feedback deleted' });
    } catch (err) {
        next(err);
    }
};

