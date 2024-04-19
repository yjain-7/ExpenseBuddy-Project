const Transaction = require('../models/Transaction');

exports.addUnsettled = async (unsettled, debts) => {
    if (unsettled.length === 0) {
        for (const debt of debts) {
            if(debt.owedBy === debt.paidBy){
                continue
            }
            try {
                const transaction = new Transaction({
                    owedBy: debt.owedBy,
                    paidBy: debt.paidBy,
                    amount: debt.amount,
                    settled: false
                });
                const savedTransaction = await transaction.save();
                unsettled.push(savedTransaction._id);
            } catch (error) {
                console.error('Error saving transaction:', error);
                return false;
            }
        }
        console.log(unsettled)
        return unsettled
    } else {
        // Handle case when unsettled array is not empty
        for (const debt of debts) {
            if(debt.owedBy === debt.paidBy){
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
                }else if(transactionInverse){
                    if(debt.amount > transactionInverse.amount){
                        const transaction = new Transaction({
                            owedBy: debt.owedBy,
                            paidBy: debt.paidBy,
                            amount: debt.amount-transactionInverse.amount,
                            settled: false
                        });
                        await Transaction.deleteOne(transactionInverse)
                        const savedTransaction = await transaction.save();
                        unsettled.push(savedTransaction._id);    
                    }else{

                    }
                } else {
                    const transaction = new Transaction({
                        owedBy: debt.owedBy,
                        paidBy: debt.paidBy,
                        amount: debt.amount,
                        settled: false
                    });
                    const savedTransaction = await transaction.save();
                    unsettled.push(savedTransaction._id);
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
