const Group = require("../models/Group");
const User = require('../models/User');
const expenseService = require("../services/ExpenseService");
const groupService = require("../services/GroupService");
const { getUnsettledListInfo } = require("../services/TransactionService");
const Transaction = require("../models/Transaction");

exports.addExpense = async (req, res) => {
  try {
    console.log(req.body);
    const { groupCode, debts, paidBy } = req.body;

    const group = groupService.getGroupObject(groupCode);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    req.groupId = group._id;
    console.log(req.groupId);
    const expense = await expenseService.createExpense(req);
    console.log(expense);

    if (!expense) {
      return res.status(500).json({ message: "Failed to add expense" });
    }

    console.log(debts);

    const { unsettled, expenseList } = await groupService.addExpense(req, groupCode, debts, paidBy, expense);
    if (!unsettled) {
      return res
        .status(500)
        .json({ message: "Failed to add expense to group" });
    }

    const unsettledListInfo = await getUnsettledListInfo(unsettled);
    const expenseListInfo = await expenseService.getExpenseList(expenseList);
    return res
      .status(200)
      .json({
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
    console.log("In simplifyController");
    const groupCode = req.body.groupCode;
    const group = await groupService.getGroupObject(groupCode);
    console.log(group.unsettled);

    const newUnsettled = await expenseService.simplify(group.unsettled);
    console.log("New unsettled transactions:", newUnsettled);

    const newUnsettledList = await saveTransaction(newUnsettled);
    const newUnsettledInfo = await getUnsettledListInfo(newUnsettledList)
    console.log("New unsettled transaction IDs:", newUnsettledList);

    group.unsettled = newUnsettledList;
    const user = await User.findOne({ _id: req.userId })
    group.activities.unshift(`Simplification made by ${user.firstName} ${user.lastName}.`);
    await group.save();

    return res.status(200).json({
      message: "Expenses simplified successfully",
      unsettled: newUnsettledInfo,
    });
  } catch (err) {
    console.log("Error in simplifyController:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.settle = async (req, res) => {
  try {
    const groupCode = req.body.groupCode;
    const unsettledId = req.body.unsettledId
    const group = await groupService.getGroupObject(groupCode)

    console.log("Before unsettle\n" + group.unsettled)
    group.unsettled = group.unsettled.filter(id => id.toString() !== unsettledId.toString());
    console.log("After unsettle\n" + group.unsettled)
    const transaction = await Transaction.findById({ _id: unsettledId })
    group.activities.unshift(`${transaction.owedBy} settled ${transaction.amount} with ${transaction.paidBy}`)
    await group.save()
    return res.status(200).json({ message: "Settlement done" })
  } catch (err) {
    console.log("Error in simplifyController:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
}

async function saveTransaction(newUnsettled) {
  const unsettledList = [];
  try {
    for (const trans of newUnsettled) {
      console.log("Saving transaction:", trans);
      const transaction = new Transaction({
        paidBy: trans.paidBy,
        owedBy: trans.owedBy,
        amount: trans.amount,
        settled: false,
      });
      const savedTransaction = await transaction.save();
      console.log("Saved transaction:", savedTransaction);
      unsettledList.push(savedTransaction._id);
    }
    return unsettledList;
  } catch (err) {
    console.log("Error in saveTransaction:", err.message);
    throw err;
  }
}
