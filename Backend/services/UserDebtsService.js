const UserDebts = require('../models/UserDebts')

exports.createDebt = async(debts, paidBy) => {

    const debtIds = [];

    for (const debtInfo of debts) {
        const newDebt = new UserDebts({
            owedBy: debtInfo.owedBy,
            padiBy: paidBy,
            amount: debtInfo.amount,
        });

        const savedDebt = await newDebt.save();

        debtIds.push(savedDebt._id);
    }
    return debtIds;
}
