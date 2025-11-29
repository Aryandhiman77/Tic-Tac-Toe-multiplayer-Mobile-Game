const jwt = require("jsonwebtoken");
const { io } = require("socket.io-client");
const jwtSecret =process.env.JWT_SECRET;
const User = require('../db/modals/User.Model');
module.exports =async function (socket, next) {
  const token = socket.handshake.headers["authorization"]?.split(" ")[1];

  if (!token) {
    console.log("no token found.");
    return next(new Error("Authentication error."));
  }

  // verify the token, etc.
  try {
    //1. DECORDED TOKEN TO GET USERINFO FROM DB
    const user = jwt.verify(token, jwtSecret);
    const userDetails = await User.findById(user?.id);

    //2.SET THE IMPORTANT DATA INTO SOCKET AND CONTINUE
    socket.username = userDetails?.username; 
    socket.email = userDetails?.email; 
    socket.userid = userDetails?.id; 
    socket.gameid = userDetails?.gameid; 
    socket.gameid = userDetails?.gameid; 
    socket.profile = userDetails?.profile;
    next();
  } catch (err) {
    console.log("SOCKET MIDDLEWARE ERROR :", err);

    // 3. HANDLE IF TOKEN EXPIRES OR INVALIDATES  
    if (err.name === "TokenExpiredError") {
      return next(new Error(err.name));
    }
    return next(new Error("InvalidToken"));
  }
};
