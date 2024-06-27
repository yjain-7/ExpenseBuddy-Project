const mongoose = require('mongoose')
const transactionSchema = new mongoose.Schema({
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    owedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    settled: { type: Boolean, default: false }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;     