const Group = require("../models/Group");
const User = require('../models/User');
const expenseService = require("../services/ExpenseService");
const groupService = require("../services/GroupService");
const { getUnsettledListInfo } = require("../services/TransactionService");
const Transaction = require("../models/Transaction");

exports.addExpense = async (req, res) => {
  try {
    const { groupCode, debts, paidBy } = req.body;

    const group = groupService.getGroupObject(groupCode);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    req.groupId = group._id;
    const expense = await expenseService.createExpense(req);

    if (!expense) {
      return res.status(500).json({ message: "Failed to add expense" });
    }

    const { unsettled, expenseList,activity, userListInfoMap } = await groupService.addExpense(req, groupCode, debts, paidBy, expense);
    if (!unsettled) {
      return res
        .status(500)
        .json({ message: "Failed to add expense to group" });
    }
    const unsettledListInfo = await getUnsettledListInfo(unsettled, userListInfoMap);
    const expenseListInfo = await expenseService.getExpenseList(expenseList, userListInfoMap);
    return res
      .status(200)
      .json({
        message: "Expense added successfully",
        expense: expense,
        unsettled: unsettledListInfo,
        expenseList: expenseListInfo,
        activity : activity 
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
    const userListInfoMap = await getUserListInfoMap(group.usersList);

    const newUnsettled = await expenseService.simplify(group.unsettled);

    const newUnsettledList = await saveTransaction(newUnsettled);
    const newUnsettledInfo = await getUnsettledListInfo(newUnsettledList, userListInfoMap)

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

    group.unsettled = group.unsettled.filter(id => id.toString() !== unsettledId.toString());
    const transaction = await Transaction.findById({ _id: unsettledId });
    const [owedByUser, paidByUser] = await Promise.all([
      User.findById({ _id: transaction.owedBy }),
      User.findById({ _id: transaction.paidBy })
    ])

    const activity = `${owedByUser.firstName} settled ${transaction.amount} with ${paidByUser.firstName}`
    group.activities.unshift(activity)
    await group.save()
    return res.status(200).json({ message: "Settlement done", activity: activity })
  } catch (err) {
    console.log("Error in simplifyController:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
}

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
    console.log("Error in saveTransaction:", err.message);
    throw err;
  }
}


async function getUserListInfoMap(userList) {
  let userListInfoMap = {};

  // Fetch only the firstname and lastname fields for the users whose IDs are in the userList array
  const users = await User.find({ _id: { $in: userList } }, 'firstName lastName');

  // Create the mapping of user IDs to full names
  users.forEach(user => {
      const fullName = `${user.firstName} ${user.lastName}`;
      userListInfoMap[user._id] = fullName;
  });

  return userListInfoMap;
}