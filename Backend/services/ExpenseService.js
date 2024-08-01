const Expense = require('../models/Expense');
const Transaction = require('../models/Transaction');
const simplify = require('../utils/Simplify');
const debtsService = require('./UserDebtsService');
const userService = require('./UserService');

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
  const transactions = [];
  for (const trans of unsettled) {
    try {
      const transaction = await Transaction.findById(trans);
      if (transaction) {
        transactions.push(transaction);
      }
    } catch (error) {
      console.error(`Error fetching transaction with ID ${trans}:`, error);
    }
  }

  const simplified = simplify.simplifyDebts(transactions);
  return simplified;
};

exports.getExpenseList = async (expenseList) => {
  const expenses = [];
  for (const expenseId of expenseList) {
    try {
      const expense = await Expense.findById(expenseId);
      if (expense) {
        const [paidBy, debts, createdBy] = await Promise.all([
          userService.getUserInfo(expense.paidBy),
          debtsService.getDebtInfo(expense.debts),
          userService.getUserInfo(expense.createdBy)
        ]);

        expenses.push({
          _id: expense._id,
          title: expense.title,
          description: expense.description,
          amount: expense.totalAmount,
          createdBy: createdBy.firstName,
          paidBy: paidBy.firstName,
          debts,
          date: expense.date,
        });
      }
    } catch (err) {
      console.error(`Error extracting expense: ${err}`);
    }
  }
  return expenses;
};
