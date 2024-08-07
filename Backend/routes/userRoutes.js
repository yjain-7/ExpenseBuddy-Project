const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');

// Define routes
userRouter.post('/signup', userController.signUp);
userRouter.post('/login', userController.login);
userRouter.post('/leaveGroup', userController.leaveGroup)

module.exports = userRouter;
