const Expense = require('../models/Expense');
const Transaction = require('../models/Transaction');
const Debts = require('../models/UserDebts')
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
            let transaction = await Transaction.findById(trans); // Await the findById call
            if (transaction) { // Ensure the transaction is found
                transactions.push({
                    giver: transaction.paidBy.toString(), // Convert ObjectId to string
                    receiver: transaction.owedBy.toString(), // Convert ObjectId to string
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