const Expense = require('../models/Expense');
const Debt = require('../models/Debt');
const Transaction = require('../models/Transaction')
const simplify = require('../utils/Simplify')
const debtsService = require('./UserDebtsService')
const userService = require('./UserService')
const ObjectId = require('mongoose').Types.ObjectId;
exports.createExpense = async (req) => {
    try {
        const { title, totalAmount, userId, description, paidBy, groupCode, debts } = req.body;

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
            groupCode: groupCode,
            debts: debtsList,
            date: new Date()
        });

        const expense = await newExpense.save();

        if (expense) {
            console.log("Expense saved")
            return expense
        } else {
            console.log("Expense not saved")
            return null;
        }
    } catch (err) {
        console.error(err);
        return null;
    }
};

exports.simplify = async (unsettled) => {
    let transactions = [];
    console.log("IN simplify service")
    for (const trans of unsettled) {
        try {
            console.log(trans);
            let transaction = await Transaction.findById(trans);
            if (transaction) {
                transactions.push({
                    giver: transaction.paidBy.toString(),
                    receiver: transaction.owedBy.toString(),
                    amount: transaction.amount
                });
            }
        } catch (error) {
            console.error(`Error fetching transaction with ID ${trans}:`, error);
        }
    }

    console.log(transactions);
    let simplified = simplify.simplifyDebts(transactions);
    console.log(simplified);
};

exports.getExpenseList = async (expenseList) => {
    let expenses = [];
    for (const expenseid of expenseList) {
        try {
            let expense = await Expense.findById(expenseid);
            if (expense) {
                const [paidBy, debts, createdBy] = await Promise.all([
                    userService.getUserInfo(expense.paidBy),
                    debtsService.getDebtInfo(expense.debts),
                    userService.getUserInfo(expense.createdBy),

                ]);

                expenses.push({
                    _id: expense._id,
                    description: expense.description,
                    amount: expense.totalAmount,
                    createdBy: createdBy.firstName,
                    paidBy: paidBy.firstName,
                    debts: debts,
                    date: expense.date,
                });
            }
        } catch (err) {
            console.log("Error Extracting expense " + err)
        }

    }
    return expenses
}