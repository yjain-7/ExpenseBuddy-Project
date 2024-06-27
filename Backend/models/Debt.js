const mongoose = require('mongoose')
const debtSchema = new mongoose.Schema({
    owedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
});
const Debt = mongoose.model('Debt', debtSchema);
module.exports = Debt;   