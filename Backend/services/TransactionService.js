const Transaction = require('../models/Transaction');
const User = require('../models/User')

async function getUserName(userId){
    const user = await User.findById(userId)
    console.log(user)
    return user.name
}

exports.addUnsettled = async (unsettled, debts) => {
    if (unsettled.length === 0) {
        for (const debt of debts) {
            if (debt.owedBy === debt.paidBy) {
                continue
            }
            await saveTransaction(unsettled, debt)
        }
        console.log(unsettled)
        return unsettled
    } else {
        for (const debt of debts) {
            if (debt.owedBy === debt.paidBy) {
                continue
            }
            try {
                const transaction = await Transaction.findOne({
                    owedBy: debt.owedBy,
                    paidBy: debt.paidBy,
                })

                const transactionInverse = await Transaction.findOne({
                    paidBy: debt.owedBy,
                    owedBy: debt.paidBy,
                })

                if (transaction) {
                    transaction.amount = transaction.amount + debt.amount;
                    await transaction.save();
                }
                else if (transactionInverse) {
                    inverseTransaction(unsettled, debt, transactionInverse)
                } else {
                    await saveTransaction(unsettled, debt);
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

async function saveTransaction(unsettled, debt) {
    try {
        const owedUserName = await getUserName(debt.owedBy);
        const paidUserName = await getUserName(debt.paidBy);
        console.log(owedUserName + " " +paidUserName)
        const transaction = new Transaction({
            owedBy: debt.owedBy,
            owedUserName : owedUserName,
            paidBy: debt.paidBy,
            paidUserName: paidUserName,
            amount: debt.amount,
            settled: false
        });
        const savedTransaction = await transaction.save();
        unsettled.push(savedTransaction._id);
    } catch (err) {
        console.log(err);
    }
}

async function inverseTransaction(unsettled, debt, transactionInverse) {
    const newAmount = Math.abs(debt.amount - transactionInverse.amount);
    if(newAmount == 0){
        unsettled = unsettled.filter(id => id !== transactionInverse._id);
        await Transaction.deleteOne(transactionInverse)
    }
    if(debt.amount > transactionInverse.amount) {
        const owedUserName = await getUserName(debt.owedBy);
        const paidUserName = await getUserName(debt.paidBy);
        console.log(owedUserName + " " +paidUserName)
        const transaction = new Transaction({
            owedBy: debt.owedBy,
            owedUserName : owedUserName,
            paidBy: debt.paidBy,
            paidUserName: paidUserName,
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

