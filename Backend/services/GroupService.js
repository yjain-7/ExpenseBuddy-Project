const User = require('../models/User');
const Group = require('../models/Group');
const transactionService = require('./TransactionService');
const expenseService = require('./ExpenseService');
const userService = require('./UserService');
const groupService = require('../services/GroupService');

exports.createGroup = async (userId, name, description) => {
  try {
    const groupCode = generateGroupCode();
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    const newGroup = new Group({
      groupCode,
      name,
      description,
      createdBy: { userId, name: user.name },
    });

    newGroup.usersList.push({ userId, name: user.firstName });
    const group = await newGroup.save();
    user.groupsList.push({ groupId: group._id, name: group.name, description: group.description, groupCode: group.groupCode });
    await user.save();
    return user;
  } catch (err) {
    console.error(err);
    throw new Error("Error creating group");
  }
};

exports.joinGroup = async (userId, groupCode) => {
  try {
    const group = await Group.findOne({ groupCode });
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
    group.usersList.push({ userId, name: user.firstName });
    await group.save();
    user.groupsList.push({ groupId: group._id, name: group.name, description: group.description, groupCode: group.groupCode });
    await user.save();

    return user;
  } catch (err) {
    console.error(err);
    throw new Error("Error joining group");
  }
};

exports.getAllGroups = async () => {
  try {
    const groupData = await Group.find().exec();
    const groupList = await Promise.all(groupData.map(group => getGroupData(group)));
    return groupList;
  } catch (err) {
    console.error(err);
    throw new Error('Internal Server Error');
  }
};

exports.addExpense = async (groupCode, debts, paidBy, expense) => {
  try {
    const group = await groupService.getGroupObject(groupCode);
    if (!group) {
      throw new Error("Group not found");
    }
    group.expensesList.unshift(expense._id);
    const unsettled = await transactionService.addUnsettled(group.unsettled, debts, paidBy);
    if (!unsettled) {
      return false;
    }
    group.unsettled = unsettled;
    await group.save();
    return { unsettled, expenseList: group.expensesList };
  } catch (error) {
    console.error(error);
    return false;
  }
};

exports.getGroup = async (groupCode) => {
  try {
    const group = await this.getGroupObject(groupCode);
    const groupData = {
      name: group?.name ?? 'Default Name',
      description: group?.description ?? 'No description provided',
      groupCode: groupCode ?? 'Unknown Group Code',
      createdBy: group?.createdBy ?? 'Unknown Creator',
      usersList: group?.usersList ?? []
    };

    const [expenses, unsettledList] = await Promise.all([
      expenseService.getExpenseList(group.expensesList),
      transactionService.getUnsettledList(group.unsettled)
    ]);

    groupData.expenseList = expenses;
    groupData.unsettled = unsettledList;

    return groupData;
  } catch (err) {
    console.error(err);
    return false;
  }
};

exports.getGroupObject = async (groupCode) => {
  try {
    return await Group.findOne({ groupCode });
  } catch (err) {
    console.error("Error getting group from db:", err);
    return null;
  }
};

function generateGroupCode() {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let groupCode = '';
  for (let i = 0; i < 6; i++) {
    groupCode += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return groupCode;
}

function userAlreadyExist(group, userId) {
  return group.usersList.some(user => user.userId.toString() === userId.toString());
}
