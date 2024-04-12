const express = require('express');
const groupRouter = express.Router();
const groupController = require('../controllers/groupController');
const verifyToken = require('../middlewares/authUser')
// Define routes
groupRouter.post('/createGroup',verifyToken,  groupController.createGroup);
groupRouter.post('/joinGroup', verifyToken, groupController.joinGroup);

module.exports = groupRouter;
