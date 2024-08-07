const Group = require("../models/Group");
const User = require('../models/User');
const expenseService = require("../services/ExpenseService");
const groupService = require("../services/GroupService");
const { getUnsettledListInfo } = require("../services/TransactionService");
const Transaction = require("../models/Transaction");

exports.addExpense = async (req, res) => {
  try {
    const { groupCode, debts, paidBy } = req.body;

    const group = await groupService.getGroupObject(groupCode); // Make sure this returns a promise

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    req.groupId = group._id;
    const expense = await expenseService.createExpense(req);

    if (!expense) {
      return res.status(500).json({ message: "Failed to add expense" });
    }

    const { unsettled, expenseList } = await groupService.addExpense(req, groupCode, debts, paidBy, expense);
    
    if (!unsettled) {
      return res.status(500).json({ message: "Failed to add expense to group" });
    }

    const [unsettledListInfo, expenseListInfo] = await Promise.all([
      getUnsettledListInfo(unsettled),
      expenseService.getExpenseList(expenseList)
    ]);

    return res.status(200).json({
      message: "Expense added successfully",
      expense,
      unsettled: unsettledListInfo,
      expenseList: expenseListInfo,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.simplify = async (req, res) => {
  try {
    const { groupCode } = req.body;
    const group = await groupService.getGroupObject(groupCode);

    const newUnsettled = await expenseService.simplify(group.unsettled);
    const newUnsettledList = await saveTransaction(newUnsettled);

    const newUnsettledInfo = await getUnsettledListInfo(newUnsettledList);

    const user = await User.findById(req.userId).select('firstName lastName');
    group.activities.unshift(`Simplification made by ${user.firstName} ${user.lastName}.`);
    group.unsettled = newUnsettledList;
    await group.save();

    return res.status(200).json({
      message: "Expenses simplified successfully",
      unsettled: newUnsettledInfo,
    });
  } catch (err) {
    console.error("Error in simplifyController:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.settle = async (req, res) => {
  try {
    const { groupCode, unsettledId } = req.body;
    const group = await groupService.getGroupObject(groupCode);

    group.unsettled = group.unsettled.filter(id => id.toString() !== unsettledId.toString());

    const transaction = await Transaction.findById(unsettledId).populate('owedBy paidBy', 'firstName');

    group.activities.unshift(`${transaction.owedBy.firstName} settled ${transaction.amount} with ${transaction.paidBy.firstName}`);
    await group.save();

    return res.status(200).json({ message: "Settlement done" });
  } catch (err) {
    console.error("Error in settleController:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

async function saveTransaction(newUnsettled) {
  try {
    const transactions = newUnsettled.map(trans => ({
      paidBy: trans.paidBy,
      owedBy: trans.owedBy,
      amount: trans.amount,
      settled: false,
    }));

    const savedTransactions = await Transaction.insertMany(transactions);
    return savedTransactions.map(transaction => transaction._id);
  } catch (err) {
    console.error("Error in saveTransaction:", err.message);
    throw err;
  }
}
