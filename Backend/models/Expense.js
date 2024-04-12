const mongoose = require('mongoose');
const expenseSchema = new mongoose.Schema({
    name: String,
    totalAmount:  Number,
    paidBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    group : {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
    debts : [{type: mongoose.Schema.Types.ObjectId, ref: 'UserDebts'}],
    description : String,
    date: Date,
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
