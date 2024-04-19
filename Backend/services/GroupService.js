const User = require('../models/User');
const Group = require('../models/Group')
const userService = require('./UserService')
const transactionService = require('./TransactionService')
exports.createGroup = async (userId, name, description) => {
    try {
        const groupCode = generateGroupCode();
        const newGroup = new Group({
            groupCode,
            name,
            description,
            createdBy: userId,
        });
        newGroup.usersList.push(userId);
        const group = await newGroup.save();

        // Update user with the new group ID
        const user = await User.findOne({ _id: userId });
        if (!user) {
            throw new Error("User not found");
        }
        user.groupsList.push(group._id);
        await user.save();
        return getGroupData(group);
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

        group.usersList.push(userId);
        await group.save();

        const user = await User.findOne({ _id: userId });
        if (!user) {
            throw new Error("User not found");
        }
        user.groupsList.push(group._id);
        await user.save();

        return getGroupData(group);
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
        console.error(err); // Log any errors that occur during the process
        res.status(500).send('Internal Server Error'); // Sending an error response if something goes wrong
    }
}

exports.addExpense = async (groupId, debts, expense) => {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            throw new Error("Group not found");
        }
        group.expensesList.push(expense._id);
        const unsettled = await transactionService.addUnsettled(group.unsettled, debts);
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

async function getGroupData(group) {
    try {
        let groupInfo = {
            name: group.name,
            groupCode: group.token,
            description: group.description,
            createdBy: await userService.getUserInfo(group.createdBy),
            usersList: await Promise.all(group.usersList.map(async (user) => {
                return await userService.getUserInfo(user);
            })),
            expenseList: group.expenseList,
            unsettled: group.unsettled,
            settled: group.settled
        };
        return groupInfo;
    } catch (err) {
        console.error(err);
        throw new Error("Error retrieving group data");
    }
};

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

