const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const ObjectId = mongoose.Types.ObjectId;
const userService = require('./UserService');

exports.addUnsettled = async (unsettled, debts, paidBy) => {
    if (unsettled.length === 0) {
        for (const debt of debts) {
            if (debt.owedBy === paidBy) {
                continue;
            }
            await saveTransaction(unsettled, debt, paidBy);
        }
        console.log(unsettled);
        return unsettled;
    } else {
        console.log("Unsettled length is greater than 0");
        const unsettledInfo = await getUnsettledList(unsettled);
        console.log(JSON.stringify(unsettledInfo));

        for (const debt of debts) {
            if (debt.owedBy === paidBy) {
                continue;
            }
            try {
                const transaction = findTransaction(debt.owedBy, paidBy, unsettledInfo);
                const transactionInverse = findTransaction(paidBy, debt.owedBy, unsettledInfo);

                if (transaction) {
                    console.log("Transaction found");
                    transaction.amount += debt.amount;
                    await transaction.save();
                } else if (transactionInverse) {
                    console.log("Inverse Transaction found");
                    await inverseTransaction(unsettled, debt, transactionInverse, paidBy);
                } else {
                    await saveTransaction(unsettled, debt, paidBy);
                }
            } catch (err) {
                console.log(err);
                return false;
            }
        }
    }
    console.log(unsettled);
    return unsettled;
};

function findTransaction(owedBy, paidBy, unsettledInfo) {
    for (const transaction of unsettledInfo) {
        if (transaction.owedBy === owedBy && transaction.paidBy === paidBy) {
            return transaction;
        }
    }
    return false;
}

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
        await Transaction.deleteOne({ _id: transactionInverse._id });
    } else if (debt.amount > transactionInverse.amount) {
        const transaction = new Transaction({
            paidBy: paidBy,
            owedBy: debt.owedBy,
            amount: newAmount,
            settled: false
        });

        unsettled = unsettled.filter(id => id !== transactionInverse._id);
        await Transaction.deleteOne({ _id: transactionInverse._id });
        const savedTransaction = await transaction.save();
        unsettled.push(savedTransaction._id);
    } else {
        transactionInverse.amount -= debt.amount;
        await transactionInverse.save();
    }
}

async function getUnsettledList(unsettled) {
    let unsettledList = [];
    try {
        for (const id of unsettled) {
            const transaction = await Transaction.findById(id);
            const [paidBy, owedBy] = await Promise.all([
                userService.getUserInfo(transaction.paidBy),
                userService.getUserInfo(transaction.owedBy),
            ]);
            unsettledList.push({
                id: transaction._id,
                paidBy: paidBy.firstName,
                owedBy: owedBy.firstName,
                amount: transaction.amount
            });
        }

        return unsettledList;
    } catch (err) {
        console.log(err);
        return null;
    }
}

exports.getUnsettledList = getUnsettledList;
