const Group = require("../models/Group");
const expenseService = require("../services/ExpenseService");
const groupService = require("../services/GroupService");
const { getUnsettledList } = require("../services/TransactionService");
const Transaction = require("../models/Transaction");

exports.addExpense = async (req, res) => {
  try {
    const { groupCode, debts, paidBy } = req.body;

    const group = await groupService.getGroupObject(groupCode);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    req.groupId = group._id;
    const expense = await expenseService.createExpense(req);
    if (!expense) {
      return res.status(500).json({ message: "Failed to add expense" });
    }

    const { unsettled, expenseList } = await groupService.addExpense(groupCode, debts, paidBy, expense);
    if (!unsettled) {
      return res.status(500).json({ message: "Failed to add expense to group" });
    }

    const unsettledListInfo = await getUnsettledList(unsettled);
    const expenseListInfo = await expenseService.getExpenseList(expenseList);
    return res.status(200).json({
      message: "Expense added successfully",
      expense: expense,
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
    const groupCode = req.body.groupCode;
    const group = await groupService.getGroupObject(groupCode);

    const newUnsettled = await expenseService.simplify(group.unsettled);
    const newUnsettledList = await saveTransaction(newUnsettled);
    const newUnsettledInfo = await getUnsettledList(newUnsettledList);

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

async function saveTransaction(newUnsettled) {
  const unsettledList = [];
  try {
    for (const trans of newUnsettled) {
      const transaction = new Transaction({
        paidBy: trans.paidBy,
        owedBy: trans.owedBy,
        amount: trans.amount,
        settled: false,
      });
      const savedTransaction = await transaction.save();
      unsettledList.push(savedTransaction._id);
    }
    return unsettledList;
  } catch (err) {
    console.error("Error in saveTransaction:", err.message);
    throw err;
  }
}
