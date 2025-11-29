const express = require("express");
const Router = express.Router();
const {
  userLogin,
  userRegister,
  logoutUser,
  refreshTokens,
  forgotPass,
  resetPassword,
  uploadProfile,
} = require("../src/controllers/User.Controller"); // USER CONTROLLER

const {
  RegistrationValidations,
  LoginValidations,
} = require("./validations/Auth.validations"); // AUTHENTICATION VALIDATOR

const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendsList,
  getFriendRequest,
  searchFriendById,
  getIncomingRequests,
  withdrawMyRequest,
  removeFromFriendList,
} = require("../src/controllers/Friends.Controller"); // FRIEND SYSTEM CONTROLLER

const checkLoginMiddleware = require("./middlewares/Login.Middleware");
const { handleSingleImageUpload } = require("../src/middlewares/MulterConfig");

// =========== handle user Login , registration , logout ================

// { username, email, password }
Router.post("/auth/register", RegistrationValidations, userRegister);

// { email , password }
Router.post("/auth/login", LoginValidations, userLogin);

// { email }
Router.patch("/auth/fgtpwd", LoginValidations, forgotPass);

// reset password using token provided to user
Router.patch("/auth/resetPassword/:token", LoginValidations, resetPassword);

// refresh token
Router.post("/auth/ref", refreshTokens);

// refresh token
Router.post("/auth/logout", logoutUser);

// ================ handling user profile image ======================

Router.use(checkLoginMiddleware); //? login required routes below
Router.patch("/user/profileUpload", handleSingleImageUpload, uploadProfile);

// ==========================friends handler======================
// { friendid }
Router.post("/friend/send", sendFriendRequest);
// { friendid }
Router.post("/friend/accept", acceptFriendRequest);
// { friendid }
Router.post("/friend/reject", rejectFriendRequest); // Todo
// { friendid }
Router.post("/friend/list", getFriendsList);

Router.post("/friend/deletereq", withdrawMyRequest); // todo

Router.post("/friend/req", getFriendRequest);
// { friendid }
Router.post("/friend/search", searchFriendById);

// { friendid }
Router.post("/friend/increq", getIncomingRequests);

Router.post("/friend/rem", removeFromFriendList);

module.exports = Router;
