const User = require('../models/User');
const userService = require('../services/UserService')

exports.signUp = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const result = await userService.signUpUser({ email, password, firstName, lastName });
    if (!result) {
      return res.status(400).send("Email already registered");
    }
    res.status(201).send({ user: result, message: 'User created successfully' });
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
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Login Error' });
  }
}
