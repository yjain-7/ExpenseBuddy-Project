const User = require('../models/User');
const Group = require('../models/Group')
const transactionService = require('./TransactionService');
const expenseService = require('./ExpenseService')
const userService = require('./UserService')
const groupService = require('../services/GroupService')
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

exports.createGroup = async (userId, name, description) => {
    try {
        const groupCode = generateGroupCode();
        const user = await User.findOne({ _id: userId });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.groupsList.length === 10) {
            return null
        }
        const newGroup = new Group({
            groupCode,
            name,
            description,
            createdBy: { userId: userId, name: user.name },
        });

        newGroup.usersList.push({ userId: userId, name: user.firstName });
        const group = await newGroup.save();
        user.groupsList.push({ groupId: group._id, name: group.name, description: group.description, groupCode: group.groupCode });
        await user.save();
        return user
    } catch (err) {
        console.error(err);
        throw new Error("Error creating group");
    }
};

exports.joinGroup = async (userId, groupCode) => {
    try {
        let group = await Group.findOne({ groupCode });
        if (!group) {
            throw new Error("Invalid groupCode");
        }
        if (userAlreadyExist(group, userId)) {
            throw new Error("User already in the group");
        }


        const user = await User.findOne({ _id: userId });
        if (!user) {
            throw new Error("User not found");
        }
        if (group.usersList.length === 10) {
            return null;
        }
        group.usersList.push({ userId: userId, name: user.firstName });
        group.activities.push(`${user.firstName} ${user.lastName} joined the group.`)
        await group.save();
        user.groupsList.push({ groupId: group._id, name: group.name, description: group.description, groupCode: group.groupCode });
        await user.save();

        return user
    } catch (err) {
        console.error(err);
        throw new Error("Error joining group");
    }
};

exports.getAllGroups = async () => {
    try {
        const groupData = await Group.find().exec();
        const groupList = await Promise.all(groupData.map(group => getGroupData(group)));
        // console.log(groupList);
        return groupList;
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

exports.addExpense = async (req, groupCode, debts, paidBy, expense) => {
    try {
        // console.log(groupCode)
        const group = await groupService.getGroupObject(groupCode)
        if (!group) {
            throw new Error("Group not found");
        }
        group.expensesList.unshift(expense._id);
        const unsettled = await transactionService.addUnsettled(group.unsettled, debts, paidBy);
        if (!unsettled) {
            return false;
        }
        group.unsettled = unsettled
        const user = await User.findOne({ _id: req.userId })
        const { title, totalAmount } = req.body
        // console.log("----------------")
        // console.log("Title: " + title)
        // console.log("TotalAmount " + totalAmount)

        group.activities.unshift(`Expense '${title}' of ${totalAmount} added by ${user.firstName} ${user.lastName}.`);
        await group.save();
        return { unsettled: await transactionService.getUnsettledListInfo(unsettled), expenseList: group.expensesList };
    } catch (error) {
        console.error(error);
        return false;
    }
};


exports.getGroup = async (groupCode) => {
    try {
        let group = await this.getGroupObject(groupCode);
        let user = await User.findOne({ _id: group.createdBy.userId })
        // console.log(group)
        let groupData = {
            name: group?.name ?? 'Default Name',
            description: group?.description ?? 'No description provided',
            groupCode: groupCode ?? 'Unknown Group Code',
            createdBy: user.firstName + " " + user.lastName ?? 'Unknown Creator',
            usersList: group?.usersList ?? []
        };


        // console.log(group?.expensesList ?? [])

        const [expenses, unsettledList] = await Promise.all([
            expenseService.getExpenseList(group.expensesList),
            transactionService.getUnsettledListInfo(group.unsettled)
        ]);

        groupData.expenseList = expenses;
        groupData.unsettled = unsettledList;
        groupData.activities = group.activities
        // console.log(groupData);
        return groupData;
    } catch (err) {
        console.error(err);
        return false;
    }
}


exports.getGroupObject = async (groupCode) => {
    try {
        let group = await Group.findOne({ groupCode });
        return group
    } catch (err) {
        console.error("Error getting group form db: " + err);
    }
}

exports.removeUser = async (groupCode, userId) => {
    try {
        const group = await Group.findOne({ groupCode: groupCode });
        if (!group) {
            throw new Error('Group not found');
        }

        group.usersList = group.usersList.filter(user => user.userId !== userId);
        await group.save();
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while removing the user from the group');
    }
};

function generateGroupCode() {
    // console.log("Generating group code")
    let groupCode = '';
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    const charsetLength = charset.length;
    for (let i = 0; i < 6; i++) {
        groupCode += charset.charAt(Math.floor(Math.random() * charsetLength));
    }
    // console.log(groupCode)
    return groupCode;
}

function userAlreadyExist(group, userId) {
    return group.usersList.some(user => user.userId.toString() === userId.toString());
}


