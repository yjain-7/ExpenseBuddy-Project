const Group = require('../models/Group')
const expenseService = require('../services/ExpenseService')
const groupService = require('../services/GroupService');
const { getUnsettledList } = require('../services/TransactionService');

exports.addExpense = async (req, res) => {
    try {
        console.log(req.body)
        const { groupCode, debts, paidBy } = req.body

        const group = groupService.getGroupObject(groupCode)

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        req.groupId = group._id;
        console.log(req.groupId)
        const expense = await expenseService.createExpense(req);
        console.log(expense)

        if (!expense) {
            return res.status(500).json({ message: "Failed to add expense" });
        }

        console.log(debts)

        const {unsettled , expenseList} = await groupService.addExpense(groupCode, debts, paidBy, expense);
        if (!unsettled) {
            return res.status(500).json({ message: "Failed to add expense to group" });
        }
        const unsettledListInfo = await getUnsettledList(unsettled)
        const expenseListInfo = await expenseService.getExpenseList(expenseList)
        return res.status(200).json({ message: "Expense added successfully", expense: expense, unsettled: unsettledListInfo, expenseList : expenseListInfo});
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.simplify = async (req, res) => {
    try {
        console.log("In simplifyController")
        const groupCode = req.body.groupCode;
        const group = await groupService.getGroupObject(groupCode)
        console.log(group.unsettled)
        const newUnsettled = expenseService.simplify(group.unsettled);
        group.unsettled = newUnsettled
        await group.save();
        return res.status(200).json({ message: "Expenses simplified successfully" })
    } catch (err) {
        return res.status(500).json({ message: "Server error" })
    }
}