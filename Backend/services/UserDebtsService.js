const Debt = require('../models/Debt');
const userService = require('./UserService');

exports.createDebt = async (debts, paidBy) => {
    const debtIds = [];

    try {
        for (const debtInfo of debts) {
            const newDebt = new Debt({
                paidBy: paidBy,
                owedBy: debtInfo.owedBy,
                amount: debtInfo.amount,
            });

            const savedDebt = await newDebt.save();
            debtIds.push(savedDebt._id);
        }
    } catch (err) {
        console.error("Error creating debts: ", err);
        throw new Error("Error creating debts");
    }

    return debtIds;
}

exports.getDebtInfo = async (debtsIdList) => {
    const debtInfo = [];

    try {
        // Fetch all debts in one query
        const debts = await Debt.find({ _id: { $in: debtsIdList } }).exec();
        const owedByIds = debts.map(debt => debt.owedBy);
        
        // Fetch all users in one query
        const users = await userService.getUsersInfo(owedByIds);

        const userMap = new Map(users.map(user => [user._id.toString(), user]));

        for (const debt of debts) {
            const user = userMap.get(debt.owedBy.toString());
            debtInfo.push({
                owedBy: user.firstName,
                amount: debt.amount,
            });
        }
    } catch (err) {
        console.error("Error retrieving debt info: ", err);
        throw new Error("Error retrieving debt info");
    }

    return debtInfo;
}
