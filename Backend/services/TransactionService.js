const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const ObjectId = mongoose.Types.ObjectId;
const userService = require('./UserService');

exports.addUnsettled = async (unsettled, debts, paidBy) => {
    if (unsettled.length === 0) {
        for (const debt of debts) {
            if (debt.owedBy !== paidBy) {
                await saveTransaction(unsettled, debt, paidBy);
            }
        }
        return unsettled;
    } else {
        const unsettledInfo = await getUnsettledList(unsettled);

        for (const debt of debts) {
            if (debt.owedBy !== paidBy) {
                const transaction = findTransaction(debt.owedBy, paidBy, unsettledInfo);
                const transactionInverse = findTransaction(paidBy, debt.owedBy, unsettledInfo);

                if (transaction) {
                    transaction.amount += debt.amount;
                    await transaction.save();
                } else if (transactionInverse) {
                    await inverseTransaction(unsettled, debt, transactionInverse, paidBy);
                } else {
                    await saveTransaction(unsettled, debt, paidBy);
                }
            }
        }
    }
    return unsettled;
};

function findTransaction(owedBy, paidBy, unsettledInfo) {
    return unsettledInfo.find(transaction => transaction.owedBy === owedBy && transaction.paidBy === paidBy) || null;
}

async function saveTransaction(unsettled, debt, paidBy) {
    try {
        const transaction = new Transaction({
            paidBy,
            owedBy: debt.owedBy,
            amount: debt.amount,
            settled: false
        });
        const savedTransaction = await transaction.save();
        unsettled.push(savedTransaction._id);
    } catch (err) {
        console.error(err);
    }
}

async function inverseTransaction(unsettled, debt, transactionInverse, paidBy) {
    const newAmount = Math.abs(debt.amount - transactionInverse.amount);
    if (newAmount === 0) {
        await Transaction.deleteOne({ _id: transactionInverse._id });
        unsettled = unsettled.filter(id => id.toString() !== transactionInverse._id.toString());
    } else if (debt.amount > transactionInverse.amount) {
        await Transaction.deleteOne({ _id: transactionInverse._id });
        unsettled = unsettled.filter(id => id.toString() !== transactionInverse._id.toString());

        const transaction = new Transaction({
            paidBy,
            owedBy: debt.owedBy,
            amount: newAmount,
            settled: false
        });
        const savedTransaction = await transaction.save();
        unsettled.push(savedTransaction._id);
    } else {
        transactionInverse.amount -= debt.amount;
        await transactionInverse.save();
    }
}

async function getUnsettledList(unsettled) {
    const unsettledList = [];
    try {
        for (const id of unsettled) {
            const transaction = await Transaction.findById(id);
            if (transaction) {
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
        }
        return unsettledList;
    } catch (err) {
        console.error(err);
        return null;
    }
}

exports.getUnsettledList = getUnsettledList;
