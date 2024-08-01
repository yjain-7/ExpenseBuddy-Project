const Debt = require('../models/Debt');
const userService = require('./UserService');

exports.createDebt = async (debts, paidBy) => {
    const debtIds = [];

    for (const debtInfo of debts) {
        const newDebt = new Debt({
            paidBy,
            owedBy: debtInfo.owedBy,
            amount: debtInfo.amount,
        });

        const savedDebt = await newDebt.save();
        debtIds.push(savedDebt._id);
    }
    return debtIds;
}

exports.getDebtInfo = async (debtsIdList) => {
    const debtInfo = [];

    try {
        for (const id of debtsIdList) {
            const debt = await Debt.findById(id);
            if (debt) {
                const user = await userService.getUserInfo(debt.owedBy);
                debtInfo.push({
                    owedBy: user.firstName,
                    amount: debt.amount,
                });
            }
        }
    } catch (err) {
        console.error("Error retrieving debt info:", err);
    }
    return debtInfo;
}
