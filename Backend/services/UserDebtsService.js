const UserDebts = require('../models/UserDebts')

exports.createDebt = async(debts) => {

    const debtIds = [];

    // Create UserDebts documents for each debt
    for (const debtInfo of debts) {
        const newDebt = new UserDebts({
            owedBy: debtInfo.owedBy,
            padiBy: debtInfo.paidBy,
            amount: debtInfo.amount,
        });

        // Save the new debt
        const savedDebt = await newDebt.save();

        // Store the ID of the saved debt
        debtIds.push(savedDebt._id);
    }
    return debtIds;
}
