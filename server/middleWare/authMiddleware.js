const jwt = require('jsonwebtoken');
const authMiddleWare = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        message: 'No token provided',
      });
    }
    console.log(req.headers.authorization);
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error, 'me error');
    res.status(401).json({
      message: 'Invalid Token',
    });
  }
};
module.exports = authMiddleWare;
