const User = require('../models/User');
const JWT = require('../middlewares/authUser')

exports.signUpUser = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            res.status(400).send("Email already register");
            return;
        }
        const newUser = new User({
            email, password, firstName, lastName
        })
        await newUser.save();
        res.status(201).send({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error creating user' });
    }
}


exports.loginUser = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password

        const user = await User.findOne({ email })
        if (!user) {
            res.status(400).send("User/Email does not exist");
            return;
        }
        else if (user.password != password) {
            res.status(400).send("Wrong password");
            return;
        }
        // create token
        const userId = user._id
        let token = JWT.getToken(email, userId);
        //return response with token
        res.status(200).send({ token: token, "name": `${user.firstName} ${user.lastName}` })
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Login Error' });
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