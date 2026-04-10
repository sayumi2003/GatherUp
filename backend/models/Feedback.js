const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, default: '', maxlength: 1000 },
    },
    { timestamps: true }
);

// One feedback per payment per user
feedbackSchema.index({ userId: 1, paymentId: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
