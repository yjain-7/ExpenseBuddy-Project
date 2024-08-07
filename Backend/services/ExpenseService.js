const Expense = require('../models/Expense');
const Debt = require('../models/Debt');
const Transaction = require('../models/Transaction');
const simplify = require('../utils/Simplify');
const debtsService = require('./UserDebtsService');
const userService = require('./UserService');
const ObjectId = require('mongoose').Types.ObjectId;

exports.createExpense = async (req) => {
    try {
        const { title, totalAmount, userId, description, paidBy, groupCode, debts } = req.body;

        const debtsList = await debtsService.createDebt(debts, paidBy);
        if (!debtsList) {
            throw new Error("Failed to create debts list");
        }

        const newExpense = new Expense({
            title,
            totalAmount,
            description,
            createdBy: userId,
            paidBy,
            groupCode,
            debts: debtsList,
            date: new Date()
        });

        const expense = await newExpense.save();

        return expense || null;
    } catch (err) {
        console.error(err);
        return null;
    }
};

exports.simplify = async (unsettled) => {
    try {
        const transactions = await Promise.all(
            unsettled.map(trans => Transaction.findById(trans))
        );

        const validTransactions = transactions.filter(Boolean);

        return simplify.simplifyDebts(validTransactions);
    } catch (error) {
        console.error('Error in simplify service:', error);
        return [];
    }
};

exports.getExpenseList = async (expenseList) => {
    try {
        const expenses = await Promise.all(
            expenseList.map(async expenseId => {
                const expense = await Expense.findById(expenseId);
                if (expense) {
                    const [paidBy, debts, createdBy] = await Promise.all([
                        userService.getUserInfo(expense.paidBy),
                        debtsService.getDebtInfo(expense.debts),
                        userService.getUserInfo(expense.createdBy)
                    ]);

                    return {
                        _id: expense._id,
                        title: expense.title,
                        description: expense.description,
                        amount: expense.totalAmount,
                        createdBy: createdBy.firstName,
                        paidBy: paidBy.firstName,
                        debts,
                        date: expense.date
                    };
                }
                return null;
            })
        );

        return expenses.filter(Boolean);
    } catch (err) {
        console.error("Error extracting expenses:", err);
        return [];
    }
};
