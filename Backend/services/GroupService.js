const User = require('../models/User');
const Group = require('../models/Group')
const getUserData = require('./UserService')
const getExpenseData = require('./ExpenseService')
const getDebtData = require('./DebtExpense')

exports.getGroupData = (group)=>{
    let groupInfo = {
        name : group.name,
        groupCode : group.token,
        description : group.description,
        createdBy : getUserData(group.createdBy),
        usersList : group.usersList.map(user => getUserData(user)),
        expenseList : group.expenseList.map(expense => getExpenseData(expense)),
        unsettled : group.unsettled.map(debt => getUserDebtData(debt)),
        settled : group.unsettled.map(debt => getDebtData(debt)),
    }
} 

