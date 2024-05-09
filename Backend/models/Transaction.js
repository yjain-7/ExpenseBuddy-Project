const mongoose = require('mongoose')
const transactionSchema = new mongoose.Schema({
    owedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    owedUserName: String,
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    paidUserName: String,
    amount: Number,
    settled: Boolean
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;   