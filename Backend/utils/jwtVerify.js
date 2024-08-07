const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRETKEY = process.env.SECRETKEY

exports.getToken = (email, userId)=>{
    return jwt.sign({ email, userId }, SECRETKEY)
}