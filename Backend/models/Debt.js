const mongoose = require('mongoose')
const debtSchema = new mongoose.Schema({
    owedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required:true },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required:true },
    amount: {type: Number,required:true},
});
const Debt = mongoose.model('Debt', debtSchema);
module.exports = Debt;   