const User = require('../models/User');
const JWT = require('../utils/jwtVerify');

exports.signUpUser = async ({ email, password, firstName, lastName }) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return null; // User already exists
    }
    const newUser = new User({ email, password, firstName, lastName });
    return await newUser.save();
  } catch (err) {
    console.error(err);
    throw new Error('Error creating user');
  }
}

exports.loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return null; // User/email or password is incorrect
    }
    const userId = user._id;
    const token = JWT.getToken(email, userId);
    return { token, name: `${user.firstName} ${user.lastName}` };
  } catch (err) {
    console.error(err);
    throw new Error('Login Error');
  }
}


exports.getUserInfo = (userId) => {
    const user = User.findOne(userId)
    const userData = {
        id: userId,
        name: user.name
    }
    return userData;
}