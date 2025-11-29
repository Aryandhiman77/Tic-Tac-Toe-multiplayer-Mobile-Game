const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult, body } = require("express-validator");
const User = require("../db/modals/User.Model"); // adjust based on your structure
const jwtSecret =process.env.JWT_SECRET;
// const mailSender = require("../utils/nodeMailer");
const crypto = require("crypto");
const userLogin = async (req, res) => {
  try {
    // 1. CHECKING EXPRESS VALIDATOR ERRORS
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //2. GET USER EMAIL, PASSWORD
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
        // throw new ApiError(400,"Email and password are required.");
    }
    //3. CHECK IF USER EXISTS WITH PROVIDED EMAIL
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    //4. IF USER EXISTS, CHECK IF USER ALREADY USING THE APPLICATION RETURN BAD REQUEST
    if (user.status === "active")
      return res.status(400).json({ message: "User had already login." });

    //5. COMPARE THE PLAIN PASSWORD WITH ENCODED DB PASSWORD USING BCRYPT JS
    const isPassTrue = await bcrypt.compare(password, user.password);
    if (!isPassTrue)
      return res.status(401).json({ message: "Invalid credentials." });
    const payload = { id: user.id };

    //6.IF BCRYPT PASSWORD COMPARISON RETURNS TRUE, GENERATE AUTHENTICATION AND REFRESH TOKENS, SAVE REFRESH TOKEN
    const authToken = JWT.sign(payload, jwtSecret, { expiresIn: "2h" });
    const refreshToken = JWT.sign(payload, jwtSecret, { expiresIn: "48h" });

    user.refreshToken = refreshToken;
    // user.status = "active"; SOCKET CONNECTION WILL MAKE USER ACTIVE AND INACTIVE FOR REAL TIME STATUS
    await user.save();

    res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        username: user.username,
        email: user.email,
        userid: user.gameid,
        profile: user.profile,
      },
      authToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const userRegister = async (req, res) => {
  console.log("registration request came.");
  try {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, Email, and Password are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }

    const salt = await bcrypt.genSalt(10);
    const enc_pass = await bcrypt.hash(password, salt);

    const saveUser = await User.create({
      username,
      email,
      password: enc_pass,
    });
    console.log(saveUser);

    if (saveUser) {
      const payload = { id: saveUser.id };
      const authtoken = JWT.sign(payload, jwtSecret, { expiresIn: "2h" });
      const refreshtoken = JWT.sign(payload, jwtSecret, { expiresIn: "48h" });
      saveUser.refreshToken = refreshtoken;
      saveUser.authToken = authtoken;
      await saveUser.save();

      return res.status(200).json({
        success: true,
        message: "Registration successful.",
        user: {
          username: saveUser.username,
          email: saveUser.email,
          userid: saveUser.gameid,
          profile: saveUser.profile,
        },
        authToken: authtoken,
        refreshToken: refreshtoken,
      });
    } else {
      return res
        .status(500)
        .json({ message: "Cannot save user due to technical issues." });
    }
  } catch (error) {
    console.error("Registration Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken){
      return res.status(400).json({ message: "Refresh token required." });
    }

    // Remove refresh token from DB
    const user = await User.findOneAndUpdate(
      { refreshToken },
      { $unset: { refreshToken: 1 } }
    );

    if (!user)
      return res.status(404).json({ message: "Invalid refresh token." });

    // set user status inactive after logout
    user.status = "inactive";
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
const refreshTokens = async (req, res) => {
  console.log("providing tokens..");
  try {
    const token = req.body?.refreshToken;
    console.log("got token : ", token);
    if (!token) {
      return res.status(400).json({ message: "Refresh token is required." });
    }

    JWT.verify(token, jwtSecret, async (error, decoded) => {
      if (error) {
        return res.status(401).json({
          success: false,
          message: error.name,
        });
      }

      const user = await User.findById(decoded.id); // finding user by id  in db
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Compare with db refresh token
      if (user.refreshToken !== token) {
        return res.status(403).json({
          success: false,
          message: "Refresh token mismatch.",
        });
      }

      const payload = { id: user.id };
      const newAccessToken = JWT.sign(payload, jwtSecret, {
        expiresIn: "2h",
      });
      const newrefreshToken = JWT.sign(payload, jwtSecret, {
        expiresIn: "48h",
      });

      // Update new refresh token in DB
      user.refreshToken = newrefreshToken;
      const savedToken = await user.save();
      console.log("saved token in db");

      return res.status(200).json({
        success: true,
        message: "Token refreshed successfully.",
        authToken: newAccessToken,
        refreshToken: newrefreshToken,
      });
    });
  } catch (error) {
    console.error("Token Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const forgotPass = async (req, res) => {
  console.log("forgot password");
  try {
    // 1. GET USER POSTED EMAIL
    const { email } = req.body;
    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Email is required.",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    console.log(user);
    //  2. GENERATE A RANDOM RESET TOKEN
    const resetCode = user.createResetPasswordCode();
    await user.save();

    // 3. SEND THE TOKEN BACK TO THE USER
    const mailobj = {
      from: "TicTacToe <aryandhiman015@gmail.com>",
      to: email,
      subject: "Tic Tac Toe password reset",
      html: `
          <h1>We have received a password reset request. Your Tic Tac Toe multiplayer password Reset Code is: ${resetCode}</h1><br>
          <p>This reset code will be valid for only 10 minutes.</p>
          `,
    };
    const ismailSent = await mailSender({ ...mailobj });
    if (ismailSent) {
      res.status(200).json({
        success: true,
        message: "Reset Code sent to your email, please enter the 6 digit otp.",
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Cannot send reset code." });
    }
  } catch (error) {
    console.error("Forgot password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
const resetPassword = async (req, res) => {
  console.log("resetting password");
  const { token } = req.params;
  const { password } = req.body;
  console.log(token, password);
  try {
    // 1. SEND ERROR IF NO PASSWORD ENTERED -VALIDATION
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "New password is required." });
    }
    // 2. ENCRYPTED THE TOKEN GOT FROM USER AND FIND THE USER WHERE ENCRYPTED TOKEN MATCHES
    const encToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetCode: encToken,
      passwordResetCodeExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Password Reset Code is invalid or has expired.",
      });
    }

    //3. ENCRYPT THE NEW PASSWORD AND SAVE THE NEW ENCRYPTED PASSWORD TO DB
    const salt = await bcrypt.genSalt(10);
    const enc_pass = await bcrypt.hash(password, salt);
    user.password = enc_pass;
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpires = undefined;
    user.passwordChangedAt = Date.now();

    const saved = await user.save();
    if (saved) {
      return res
        .status(200)
        .json({ success: true, message: "Password changed successfully." });
    }
    return res.status(400).json({
      success: false,
      message: "Cannot change password due to some technical issues.",
    });
  } catch (error) {
    console.error("Forgot password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const uploadProfile = async (req, res) => {
 
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile photo is required.",
      });
    }
    const updatedProfile = await User.findByIdAndUpdate(req.user.id, {
      profile: `/${req.file?.filename}`,
    });
    if (updatedProfile) {
      return res.status(200).json({
        success: true,
        message: "Profile uploaded successfully.",
        uri: `/${req.file?.filename}`,
      });
    }
    return res.status(400).json({
      success: false,
      message: "Cannot upload profile due to some technical issues.",
    });
  } catch (error) {
    console.log("Upload Profile Error:", error);
    res
      .status(500)
      .json({ status: false, error: "file upload failed due to : " + error });
  }
};
module.exports = {
  userLogin,
  userRegister,
  refreshTokens,
  logoutUser,
  forgotPass,
  resetPassword,
  uploadProfile,
};
