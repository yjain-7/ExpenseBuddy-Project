const Debt = require('../models/Debt')

exports.createDebt = async(debts, paidBy) => {
    console.log(debts)
    console.log(paidBy)

    const debtIds = [];

    for (const debtInfo of debts) {
        const newDebt = new Debt({
            paidBy: paidBy,
            owedBy: debtInfo.owedBy,
            amount: debtInfo.amount,
        });

        const savedDebt = await newDebt.save();

        debtIds.push(savedDebt._id);
    }
    return debtIds;
}
