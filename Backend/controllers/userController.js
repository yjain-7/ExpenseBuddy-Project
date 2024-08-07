const User = require('../models/User');
const groupService = require('../services/GroupService')
const userService = require('../services/UserService')

exports.signUp = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const result = await userService.signUpUser({ email, password, firstName, lastName });
    if (!result) {
      return res.status(400).send("Email already registered");
    }
    const userData = getUserData(result)
    res.status(201).send({ user: userData, message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error creating user' });
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    if (!result) {
      return res.status(400).send("Invalid email or password");
    }
    // console.log(result)
    const userData = getUserData(result);
    userData.token = result.token
    res.status(200).send({ userInfo: userData, message: "Login Successfullly" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Login Error' });
  }
}

exports.leaveGroup = async (req, res) => {
  try {
    const { groupCode, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    user.groupsList = user.groupsList.filter(group => group.groupCode !== groupCode);
    const flag = await groupService.removeUser(groupCode, userId);
    if(flag){
      await user.save();
      const userInfo = { id: user.id, firstName: user.firstName, lastName: user.lastName, groupsList: user.groupsList, token: token };

      res.status(200).send({ message: 'Successfully left the group', groupsList : user.groupsList});
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while leaving the group' });
  }
};

function getUserData(result) {
  const user = {
    id: result.id,
    firstName: result.firstName,
    lastName: result.lastName,
    groupsList: result.groupsList
  }
  // console.log(user)
  return user
}