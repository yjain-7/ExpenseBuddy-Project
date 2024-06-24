const Expense = require('../models/Expense')
const Debts = require('../models/UserDebts')
const simplify = require('../utils/Simplify')
const debtsService = require('./UserDebtsService')
exports.createExpense = async (req) => {
    try {
        const { title, totalAmount, userId, description, paidBy, groupId, debts } = req.body;

        const debtsList = await debtsService.createDebt(debts, paidBy);
        if (!debtsList) {
            throw new Error("Failed to create debts list");
        }

        const newExpense = new Expense({
            title: title,
            totalAmount: totalAmount,
            description: description,
            createdBy: userId,
            paidBy: paidBy,
            groupId: groupId,
            debts: debtsList,
            date: new Date()
        });
        
        return await newExpense.save();
    } catch (err) {
        console.error(err);
        return null;
    }
};

exports.simplify = async(unsettled)=>{
    const unsettledDebts = await Debt.find({ _id: { $in: group.unsettled } });
    const newUnsettledDebts = simplify.simplifyDebts(unsettledDebts);
    const debtsList = await debtsService.addDebt(newUnsettledDebts);
    return debtsList
}