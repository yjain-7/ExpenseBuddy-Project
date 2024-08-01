const Group = require("../models/Group");
const expenseService = require("../services/ExpenseService");
const groupService = require("../services/GroupService");
const { getUnsettledList } = require("../services/TransactionService");
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

    const { unsettled, expenseList } = await groupService.addExpense(
      groupCode,
      debts,
      paidBy,
      expense
    );
    if (!unsettled) {
      return res
        .status(500)
        .json({ message: "Failed to add expense to group" });
    }
    const unsettledListInfo = await getUnsettledList(unsettled);
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
      const newUnsettledInfo = await getUnsettledList(newUnsettledList)
      console.log("New unsettled transaction IDs:", newUnsettledList);
  
      group.unsettled = newUnsettledList;
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
      throw err; // Re-throw the error to handle it in the calling function
    }
  }
  