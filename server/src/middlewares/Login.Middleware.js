const jwt = require("jsonwebtoken");
const User = require("../db/modals/User.Model");
const jwtSecret = process.env.JWT_SECRET;

module.exports = async function LoginMiddleware(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    // 1. DECODE THE USER ID
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded) {
      req.user = decoded;
      // 2. GET THE USER INFO FROM DB AND SET IT INTO REQUEST OBJECT
      const userinfo = await User.findById(decoded.id);
      req.mygameid = userinfo.gameid;
    }
    next();
  } catch (error) {
    // 3. IF TOKEN ERROR, THROUGH 401
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: error.name });
    }
  }
};
