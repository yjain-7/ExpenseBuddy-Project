const User = require('../models/User')
const Group = require('../models/Group')

exports.addExpense = async (req, res) =>{
    try{
        const userId = req.userId;

    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
}

exports.settleExpense = async(req, res) =>{
    try{

    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
}


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