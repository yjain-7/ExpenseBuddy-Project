const Expense = require('../models/Expense');
const Debt = require('../models/Debt');
const simplify = require('../utils/Simplify')
const debtsService = require('./UserDebtsService')
const ObjectId = require('mongoose').Types.ObjectId;
exports.createExpense = async (req) => {
    try {
        const { title, totalAmount, userId, description, paidBy, groupCode, debts } = req.body;

        const debtsList = await debtsService.createDebt(debts, paidBy);
        if (!debtsList) {
            throw new Error("Failed to create debts list");
        }

        const newExpense = new Expense({
            title: title,
            totalAmount: totalAmount,
            description: description,
            createdBy: userId,
            paidBy: paidBy,
            groupCode: groupCode,
            debts: debtsList,
            date: new Date()
        });

        const expense = await newExpense.save();
        
        if(expense){
            console.log("Expense saved")
            return expense
        }else{
            console.log("Expense not saved")
            return null;
        }
    } catch (err) {
        console.error(err);
        return null;
    }
};

exports.simplify = async (unsettled) => {
    let transactions = [];
    
    for (const trans of unsettled) {
        try {
            console.log(trans);
            let transaction = await Debt.findById(trans);
            if (transaction) { 
                transactions.push({
                    giver: transaction.paidBy.toString(), 
                    receiver: transaction.owedBy.toString(),
                    amount: transaction.amount
                });
            }
        } catch (error) {
            console.error(`Error fetching transaction with ID ${trans}:`, error);
        }
    }
    
    console.log(transactions);
    let simplified = simplify.simplifyDebts(transactions);
    console.log(simplified);
};