const User = require('../models/User');
const JWT = require('../utils/jwtVerify');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.signUpUser = async ({ email, password, firstName, lastName }) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return null; // User already exists
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ email, password: hashedPassword, firstName, lastName });
    
    return await newUser.save();
  } catch (err) {
    console.error("Error creating user: ", err);
    throw new Error('Error creating user');
  }
}

exports.loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null; // User/email or password is incorrect
    }

    const userId = user._id;
    const token = JWT.getToken(email, userId);
    
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      groupsList: user.groupsList,
      token: token
    };
  } catch (err) {
    console.error("Login error: ", err);
    throw new Error('Login Error');
  }
}

exports.getUserInfo = async (userId) => {
  try {
    const user = await User.find({_id:userId}); // Use findById instead of findOne for clarity
    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: userId,
      firstName: user.firstName,
      lastName: user.lastName
    };
  } catch (err) {
    console.error("Error retrieving user information: ", err);
    throw new Error("Error retrieving user information");
  }
}
