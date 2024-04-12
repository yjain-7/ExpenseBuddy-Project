const User = require('../models/User')
const Group = require('../models/Group')

exports.createGroup = async (req, res) => {
    try {
        const userId = req.userId;
        //group data
        const { name, description } = req.body;

        const groupCode = generateGroupCode();
        console.log(groupCode);

        const newGroup = new Group({
            groupCode,
            name,
            description,
            createdBy: userId,
        })
        newGroup.usersList.push(userId);
        console.log(newGroup);

        const group = await newGroup.save();

        // Update user with the new group ID
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.groupsList.push(group._id);
        await user.save();

        return res.status(200).json({ message: "Group Created Successfully", groupData: group });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};


exports.joinGroup = async (req, res) => {
    try {
        const userId = req.userId;

        const { groupCode } = req.body;
        let group = await Group.findOne({ groupCode })
        if (!group) {
            res.status(404).send("Invalid groupCode");
            return;
        }
        //check if user is already in that group
        if (userAlreadyExist(group, userId)) {
            res.status(411).json({ msg: "User already in the group" });
            return;
        }
        group.usersList.push(userId);
        group.save();
        const user = User.findOne({ _id: userId })
            .then((u) => {
                u.groupsList.push(group._id)
                u.save().then(() => res.status(200).json({ message: "Group Joined Successfully", groupData: group }))
            })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" });
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