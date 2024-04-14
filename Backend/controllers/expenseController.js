const User = require('../models/User')
const Group = require('../models/Group')
const expenseService = require('../services/ExpenseService')

exports.addExpense = async (req, res) =>{
    try{
        // const userId = req.userId;
        const groupId = req.head.groupId;
        const expense = expenseService.addExpense(req, groupId)
        const group = await Group.findById(groupId);
        group.expensesList.push(expense._id);
        await group.save();

        return res.status(200).json({ message: "Expense added successfully" });

    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
}

// exports.settleExpense = async(req, res) =>{
//     try{

//     }catch(err){
//         console.log(err);
//         return res.status(500).json({ message: "Server error" });
//     }
// }


// {
//     name : "food",
//     price : ,100
//     paidBy : userId,
//     group : token/id,
//     debts : [
//         {
//             padiBy : user1
//             owedBy : user2,
//             amount : 25
//         },
//         {
//             padiBy : user1
//             owedBy : user3,
//             amount : 25
//         },
//         {
//             padiBy : user1
//             owedBy : user4,
//             amount : 25
//         },
//     ]
//     description ; "Street food"
//     date : date
// }