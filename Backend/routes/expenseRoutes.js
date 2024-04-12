const express = require('express');
const expenseRouter = express.Router();
const expenseController  = require('../controllers/expenseController');
const verifyToken = require('../middlewares/authUser')
// Define routes
expenseRouter.post('/addExpense',verifyToken,  expenseController.addExpense);
expenseRouter.post('/', verifyToken, expenseController.settleExpense);

module.exports = expenseRouter;
