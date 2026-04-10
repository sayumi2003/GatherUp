const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        eventName: { type: String, required: true, trim: true },
        amount: { type: Number, required: true, min: 0 },
        status: {
            type: String,
            enum: ['pending', 'completed', 'refunded'],
            default: 'pending',
        },
        method: {
            type: String,
            enum: ['card', 'upi', 'netbanking', 'cash'],
            default: 'card',
        },
        transactionId: { type: String, default: '' },
        refundReason: { type: String, default: '' },
        receiptGeneratedAt: { type: Date },
        notes: { type: String, default: '' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
