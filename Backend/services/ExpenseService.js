const Expense = require('../models/Expense')
const debtsService = require('../services/DebtsService')
exports.addExpense = async (req) => {
    try {
        const { title, totalAmount, userId, description, paidBy, groupId, debts } = req.body;

        const debtsList = await debtsService.addDebt(debts);
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