const jwt = require('jsonwebtoken');
const SECRETKEY = "expensebuddy"


const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRETKEY);
    req.userId = decoded.userId; // Attach userId to request object for later use
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

exports.getToken = (emai, userId)=>{
  return jwt.sign({ email, userId }, SECRETKEY)
}

module.exports = verifyToken;
