const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const ObjectId = mongoose.Types.ObjectId;
const userService = require("./UserService");

exports.addUnsettled = async (unsettled, debts, paidBy) => {
    if (unsettled.length === 0) {
        for (const debt of debts) {
            if (paidBy.toString() === debt.owedBy) continue;
            const transaction = new Transaction({
                paidBy: paidBy,
                owedBy: debt.owedBy,
                amount: debt.amount,
            });

            const savedTransaction = await transaction.save();
            unsettled.push(savedTransaction._id.toString());
        }
    } else {
        const unsettleList = await getUnsettledList(unsettled);
        // console.log("Unsettle list greater than 0\n" + JSON.stringify(unsettleList));

        for (const debt of debts) {
            if (debt.owedBy === paidBy.toString()) continue;

            const transaction = findTransaction(paidBy.toString(), debt.owedBy, unsettleList);
            const inverseTransaction = findTransaction(debt.owedBy, paidBy.toString(), unsettleList);

            if (transaction) {
                // console.log("Transaction found\n" + transaction);
                transaction.amount = parseFloat(transaction.amount) + parseFloat(debt.amount);
                await transaction.save();
            } else if (inverseTransaction) {
                // console.log("InverseTransaction found\n" + inverseTransaction);
                const newAmount = parseFloat(inverseTransaction.amount) - parseFloat(debt.amount);
                // console.log("New amount after deduction: " + newAmount);

                if (newAmount < 0) {
                    removeUnsettledTransaction(unsettled, inverseTransaction._id.toString());
                    const newTransaction = new Transaction({
                        paidBy: paidBy,
                        owedBy: debt.owedBy,
                        amount: -newAmount,
                    });
                    const savedTransaction = await newTransaction.save();
                    unsettled.push(savedTransaction._id.toString());
                } else if (newAmount > 0) {
                    inverseTransaction.amount = newAmount;
                    await inverseTransaction.save();
                } else {
                    removeUnsettledTransaction(unsettled, inverseTransaction._id.toString());
                }
            } else {
                const newTransaction = new Transaction({
                    paidBy: paidBy,
                    owedBy: debt.owedBy,
                    amount: debt.amount,
                });
                const savedTransaction = await newTransaction.save();
                unsettled.push(savedTransaction._id.toString());
            }
        }
    }

    return unsettled;
};

function findTransaction(paidBy, owedBy, unsettledList) {
    for (const transaction of unsettledList) {
        if (transaction.paidBy.toString() === paidBy && transaction.owedBy.toString() === owedBy) {
            return transaction;
        }
    }
    // console.log("Transaction not found");
    return null;
}

async function getUnsettledList(unsettled) {
    try {
        const unsettledList = [];
        for (const id of unsettled) {
            const objectId = new ObjectId(id);
            const transaction = await Transaction.findById(objectId);
            unsettledList.push(transaction);
        }
        return unsettledList;
    } catch (err) {
        console.log(err);
        return null;
    }
}

function removeUnsettledTransaction(unsettled, transactionId) {
    const index = unsettled.indexOf(transactionId);
    if (index > -1) {
        unsettled.splice(index, 1);
    }
}

exports.getUnsettledListInfo = async (unsettled) => {
    try {
        const unsettledList = [];
        for (const id of unsettled) {
            const objectId = new ObjectId(id);
            const transaction = await Transaction.findById(objectId);
            unsettledList.push({
                id: transaction.id.toString(),
                paidBy: (await userService.getUserInfo(transaction.paidBy)).firstName,
                owedBy: (await userService.getUserInfo(transaction.owedBy)).firstName,
                amount: parseFloat(transaction.amount),
            });
        }
        return unsettledList;
    } catch (err) {
        console.log(err);
        return null;
    }
};
