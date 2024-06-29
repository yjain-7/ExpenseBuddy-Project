const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const User = require('../models/User')
const ObjectId = mongoose.Types.ObjectId;
const userService = require('./UserService')

exports.addUnsettled = async (unsettled, debts, paidBy) => {
    console.log(debts)

    if (unsettled.length === 0) {
        for (const debt of debts) {
            if (debt.owedBy === paidBy) {
                continue
            }
            await saveTransaction(unsettled, debt, paidBy)
        }
        console.log(unsettled)
        return unsettled
    } else {
        console.log("Unsettled length is greater then 0")
        for (const debt of debts) {
            if (debt.owedBy === paidBy) {
                continue
            }
            try {
                const transaction = await Transaction.findOne({
                    owedBy: debt.owedBy,
                    paidBy: paidBy,
                })

                const transactionInverse = await Transaction.findOne({
                    paidBy: debt.owedBy,
                    owedBy: paidBy,
                })

                if (transaction) {
                    console.log("Transaction found")
                    transaction.amount = transaction.amount + debt.amount;
                    await transaction.save();
                }
                else if (transactionInverse) {
                    console.log("InverseTransaction found")
                    inverseTransaction(unsettled, debt, transactionInverse, paidBy)
                } else {
                    await saveTransaction(unsettled, debt, paidBy);
                }
            } catch (err) {
                console.log(err);
                return false;
            }
        }
    }
    console.log(unsettled)
    return unsettled
};

async function saveTransaction(unsettled, debt, paidBy) {
    try {
        const transaction = new Transaction({
            paidBy: paidBy,
            owedBy: debt.owedBy,
            amount: debt.amount,
            settled: false
        });
        const savedTransaction = await transaction.save();
        unsettled.push(savedTransaction._id);
    } catch (err) {
        console.log(err);
    }
}

async function inverseTransaction(unsettled, debt, transactionInverse, paidBy) {
    const newAmount = Math.abs(debt.amount - transactionInverse.amount);
    if (newAmount == 0) {
        unsettled = unsettled.filter(id => id !== transactionInverse._id);
        await Transaction.deleteOne(transactionInverse)
    }
    if (debt.amount > transactionInverse.amount) {
        const transaction = new Transaction({
            paidBy: paidBy,
            owedBy: debt.owedBy,
            amount: newAmount,
            settled: false
        });

        unsettled = unsettled.filter(id => id !== transactionInverse._id);
        await Transaction.deleteOne(transactionInverse)
        const savedTransaction = await transaction.save();
        unsettled.push(savedTransaction._id);
    } else {
        transactionInverse.amount = transactionInverse.amount - debt.amount;
        await transactionInverse.save();
    }
}

exports.getUnsettledList = async (unsettled) => {
    let unsettledList = []
    try {
        for (const id in unsettled) {
            const transaction = await Transaction.findById(unsettled[id]);
            const [paidBy, owedBy] = await Promise.all([
                userService.getUserInfo(transaction.paidBy),
                userService.getUserInfo(transaction.owedBy),
            ])
            unsettledList.push({
                id: transaction._id,
                paidBy: paidBy.firstName,
                owedBy: owedBy.firstName,
                amount: transaction.amount
            });
        }

        return unsettledList

    }
    catch (err) {
        console.log(err)
        return null;
    }
}
