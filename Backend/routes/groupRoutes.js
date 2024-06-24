const express = require('express');
const groupRouter = express.Router();
const groupController = require('../controllers/groupController');
const verifyToken = require('../middlewares/authUser');
const { verify } = require('jsonwebtoken');
// Define routes
groupRouter.post('/createGroup',verifyToken,  groupController.createGroup);
groupRouter.post('/joinGroup', verifyToken, groupController.joinGroup);
groupRouter.get('/getGroup', verifyToken, groupController.getGroup);

groupRouter.get('/getGroups', verifyToken, groupController.getGroups);

module.exports = groupRouter;
