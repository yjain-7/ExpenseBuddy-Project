const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const ObjectId = mongoose.Types.ObjectId;
const userService = require("./UserService");

exports.addUnsettled = async (unsettled, debts, paidBy) => {
    let updatedList = [];
    let updatedListInfo = [];
    if (unsettled.length == 0) {
        for (const debt of debts) {
            if (paidBy === debt.owedBy) continue;
            const transaction = new Transaction({
                paidBy: paidBy,
                owedBy: debt.owedBy,
                amount: debt.amount,
            });

            const savedTransaction = transaction.save();
            updatedList.push((await savedTransaction)._id.toString());
            updatedListInfo.push({
                paidBy: paidBy,
                owedBy: debt.owedBy,
                amount: debt.amount,
            });
        }
    } else {
        const unsettleList = getUnsettledList(unsettled);
        // console.log("Unsettle list greater then 0\n" + unsettleList);
        for (const debt of debts) {
            const transaction = findTransaction(paidBy, debt.owedBy, unsettleList);
            const inverseTransaction = findTransaction(debt.owedBy, paidBy, unsettleList);

            if(transaction){
                updatedListInfo.push({
                    paidBy : paidBy,
                    owedBy : debt.owedBy,
                    amount : transaction.amount+debt.amount
                })
            }else if(inverseTransaction){
                const amount = inverseTransaction.amount - debt.amount
                
                if(amount > 0){
                    updatedListInfo.push({
                        paidBy : debt.owedBy,
                        owedBy : paidBy,
                        amount : amount
                    })
                }else if(amount < 0){
                    updatedListInfo.push({
                        paidBy : paidBy,
                        owedBy : debt.owedBy,
                        amount : -amount
                    })
                }
            }
        }
        for(const trans of updatedListInfo){
            const savedTransaction = new Transaction(trans);
            updatedList.push(savedTransaction._id.toString())
        }
    }
    return updatedList;
};

function findTransaction(paidBy, owedBy, unsettledList) {
    for (const transaction of unsettledList) {
        if (transaction.paidBy === paidBy && transaction.owedBy === owedBy) {
            return transaction;
        }
    }
}

async function getUnsettledList(unsettled) {
    try {
        let unsettledList = [];
        for (const id of unsettled) {
            const transaction = await Transaction.findById(id);
            unsettledList.push({
                paidBy: transaction.paidBy,
                owedBy: transaction.owedBy,
                amount: parseFloat(transaction.amount),
            });
        }
        return unsettledList;
    } catch (err) {
        console.log(err);
        return null;
    }
}
