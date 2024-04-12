const jwt = require('jsonwebtoken');
const SECRETKEY = "expensebuddy"

exports.getToken = (email, userId)=>{
    return jwt.sign({ email, userId }, SECRETKEY)
}