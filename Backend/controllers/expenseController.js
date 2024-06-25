const User = require('../models/User')
const Group = require('../models/Group')
const expenseService = require('../services/ExpenseService')
const groupService = require('../services/GroupService')
exports.addExpense = async (req, res) => {
    try {
        console.log(req.body)
        const { groupCode, debts, paidBy} = req.body
        
        const group = await Group.findOne({ groupCode: groupCode });
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        
        req.groupId = group._id;
        
        const expense = await expenseService.createExpense(req);
        console.log(expense)
        
        if (!expense) {
            return res.status(500).json({ message: "Failed to add expense" });
        }
        
        console.log(debts)

        const unsettled = await groupService.addExpense(req.groupId, debts, paidBy, expense);
        if (!unsettled) {
            return res.status(500).json({ message: "Failed to add expense to group" });
        }
        
        return res.status(200).json({ message: "Expense added successfully", expense : expense, unsettled : unsettled});
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.simplify = async(req, res)=>{
    try{
        const groupCode = req.body.groupCode;
        const group = await Group.findOne({groupCode : groupCode});
        console.log(group.unsettled)
        const newUnsettled = expenseService.simplify(group.unsettled);
        group.unsettled = newUnsettled
        await group.save();
        return res.status(200).json({message : "Expenses simplified successfully"})
    }catch(err){
        return res.status(500).json({message : "Server error"})
    }
}