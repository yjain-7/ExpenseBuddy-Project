const User = require('../models/User');
const Group = require('../models/Group')
const transactionService = require('./TransactionService');
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
            createdBy: { userId: userId, name: user.name },
        });

        // Update user with the new group ID
        newGroup.usersList.push({ userId: userId, name: user.firstName });
        const group = await newGroup.save();
        user.groupsList.push({ groupId: group._id, name: group.name, groupCode: group.groupCode });
        await user.save();
        return group
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
        // Check if user is already in that group
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
        await group.save();
        user.groupsList.push({ groupId: group._id, name: group.name, groupCode: group.groupCode });
        await user.save();

        return group;
    } catch (err) {
        console.error(err);
        throw new Error("Error joining group");
    }
};

exports.getAllGroups = async () => {
    try {
        const groupData = await Group.find().exec();
        const groupList = await Promise.all(groupData.map(group => getGroupData(group)));
        console.log(groupList);
        return groupList;
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}
// req.groupId, req.debts, req.paidBy, expense

exports.addExpense = async (groupId, debts, paidBy, expense) => {
    try {
        console.log(groupId)
        const group = await Group.findById(groupId);
        if (!group) {
            throw new Error("Group not found");
        }
        group.expensesList.push(expense._id);
        const unsettled = await transactionService.addUnsettled(group.unsettled, debts, paidBy);
        if (!unsettled) {
            return false;
        }
        group.unsettled = unsettled
        await group.save();
        return unsettled;
    } catch (error) {
        console.error(error);
        return false;
    }
};

exports.getGroup = async (groupCode) => {
    try {
        let group = await Group.findOne({ groupCode });
        return group;
    } catch (err) {
        console.error(err);
        return false;
    }
}

function generateGroupCode() {
    console.log("Generating group code")
    let groupCode = '';
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    const charsetLength = charset.length;
    for (let i = 0; i < 6; i++) {
        groupCode += charset.charAt(Math.floor(Math.random() * charsetLength));
    }
    return groupCode;
}

function userAlreadyExist(group, userId) {
    return group.usersList.includes(userId);
}


