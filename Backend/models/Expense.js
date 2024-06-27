const mongoose = require('mongoose');
const expenseSchema = new mongoose.Schema({
    title: String,
    totalAmount:  Number,
    description : String,
    createdBy : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    paidBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    group : String,
    debts : [{type: mongoose.Schema.Types.ObjectId, ref: 'Debt'}],
    date: Date,
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
