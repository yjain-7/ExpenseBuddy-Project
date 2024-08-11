const Debt = require('../models/Debt')
const userService = require('./UserService')
exports.createDebt = async (debts, paidBy) => {
    // console.log(debts)
    // console.log(paidBy)

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


exports.getDebtInfo = async (debtsIdList, userListInfoMap) => {
    let debtInfo = []

    try {
        for (const id of debtsIdList) {
            const { owedBy, amount } = await Debt.findById(id);
            // const user = await userService.getUserInfo(owedBy)
            // console.log(user)
            debtInfo.push({
                owedBy: userListInfoMap[owedBy],
                amount,
            });
        }

    } catch (err) {
        console.log("Error retriving debt info " + err)
    }
    return debtInfo
}
