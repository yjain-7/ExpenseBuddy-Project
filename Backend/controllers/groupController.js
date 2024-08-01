const groupService = require('../services/GroupService');

exports.createGroup = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, description } = req.body;
    const userInfo = await groupService.createGroup(userId, name, description);
    res.status(200).json({ message: "Group Created Successfully", userInfo: userInfo, token: userInfo.token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const userId = req.userId;
    const { groupCode } = req.body;
    const userInfo = await groupService.joinGroup(userId, groupCode);
    if (!userInfo) {
      return res.status(400).json({ message: "Error joining group, group full" });
    }
    res.status(200).json({ message: "Group Joined Successfully", userInfo: userInfo, token: userInfo.token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getGroup = async (req, res) => {
  try {
    const { groupCode } = req.body;
    const group = await groupService.getGroup(groupCode);
    res.status(200).json({ group });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getGroups = async (req, res) => {
  try {
    const groups = await groupService.getAllGroups();
    res.status(200).json({ message: "Groups fetched successfully", groups: groups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
