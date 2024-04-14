const Expense = require('../models/Expense')

exports.addExpense = async(req, groupId)=>{
    const {title, totalAmount, userId, description, paidBy, debts, date} = req.body;

    const debtsList = debtsService.addDebts(debts);
    const newExpense = new Expense({
        title  : title,
        totalAmount : totalAmount,
        description : description,
        createdBy : userId,
        paidBy : paidBy,
        group : groupId,
        debts : debtsList,
        date : date
    })
    return await newExpense.save();
}