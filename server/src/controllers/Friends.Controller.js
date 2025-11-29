const User = require("../db/modals/User.Model");
const Friend = require("../db/modals/Friend.Model");
const mongoose = require("mongoose");
const FriendList = require("../db/modals/FriendList.Model");
const AsyncWrapper = require("../utils/AsyncWrapper");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const sendFriendRequest = async (req, res) => {
  const { friendid } = req.body;
  const { id } = req.user;
  console.log("sending friend request.");

  try {
    const existingRequest = await Friend.findOne({
      userid: id,
      friendid,
      status: "pending",
    });
    const reqToYourSelf = await User.findOne({ gameid: friendid, _id: id });
    if (reqToYourSelf){
      return res
      .status(400)
      .json({ success: false, message: "Cannot request youself." });
    }
      
    if (existingRequest) {
      return res
        .status(200)
        .json({ success: true, message: "Friend request already sent" });
    }
    const { _id: friendUserid } = await User.findOne({ gameid: friendid });
    const friendlist = await FriendList.findOne({ userid: friendUserid });
    if (friendlist?.friends.length > 0 && friendlist?.friends.includes(id)) {
      return res
        .status(200)
        .json({ success: false, message: "Already a friend." });
    }
    if (friendUserid) {
      const newRequest = new Friend({ userid: id, friendid, friendUserid });
      await newRequest.save();
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Friend not found." });
    }
    return res
      .status(200)
      .json({ success: true, message: "Friend request sent successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
};
const acceptFriendRequest = async (req, res) => {
  const { friendid } = req.body; // friendid = friend's gameid
  const { id: myUserId } = req.user; // your own user id
  console.log(friendid, myUserId);

  try {
    const senderFriend = await User.findOne({ gameid: friendid });
    // console.log(senderFriend);
    if (!senderFriend) {
      return res
        .status(404)
        .json(new ApiResponse(404,null,"Friend not found"));
    }

    const request = await Friend.findOne({
      userid: senderFriend._id,
      friendid: req.mygameid,
      friendUserid: myUserId,
      status: "pending",
    });
    if (!request) {
      return res
      .status(404)
      .json(new ApiResponse(404,null,"Friend request not found"));
    }

    // ADD BOTH USERS TO EACH OTHER'S FRIENDLIST
    const [res1, res2] = await Promise.all([
      FriendList.updateOne(
        { userid: myUserId },
        { $addToSet: { friends: senderFriend._id } },
        { upsert: true }
      ),
      FriendList.updateOne(
        { userid: senderFriend._id },
        { $addToSet: { friends: myUserId } },
        { upsert: true }
      ),
    ]);

    // IF BOTH USERS SUCCESSFULLY ADDED TO EACH OTHER'S FRIENDLIST THEN ACCEPT THE REQUEST,SAVE THE REQUEST
    if (res1.acknowledged && res2.acknowledged) {
      request.status = "accepted";
      await request.save();
    } else {
      return res
        .status(400)
        .json(new ApiResponse(400,null,"Failed to accept request."));
    }

    return res
      .status(200)
      .json(new ApiResponse(200,null,"Friend request accepted"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
};
const rejectFriendRequest = async (req, res) => {
  const { friendid } = req.body;
  //   const { id } = req.user;

  try {
    const { _id: userid } = await User.findOne({ gameid: friendid });
    if (!userid) {
      return res
        .status(404)
        .json({ success: false, message: "Friend not found" });
    }
    const request = await Friend.findOne({ userid });
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Friend request not found" });
    }

    const removeRequest = await Friend.findByIdAndDelete(request._id);
    if (removeRequest) {
      return res
        .status(200)
        .json({ success: true, message: "Friend request rejected" });
    } else {
      return res
        .status(400)
        .json({
          success: false,
          message: "Cannot reject, something went wrong.",
        });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
};
const getFriendsList = async (req, res) => {
  const { id } = req.user;
  try {
    const myFriendList = await FriendList.findOne({
      userid: id,
    }).populate({
      path: "friends",
      select: "username status gameid profile -_id", // exclude _id here
    });
    return res
      .status(200)
      .json({ success: true, friendList: myFriendList?.friends });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
};

const getFriendRequest = async (req, res) => {
  const { id } = req.user;

  try {
    const requests = await Friend.aggregate([
      {
        $match: {
          $and: [
            { userid: new mongoose.Types.ObjectId(id.toString()) },
            { status: "pending" },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "friendid",
          foreignField: "gameid",
          as: "friendDetails",
        },
      },
      {
        $unwind: {
          path: "$friendDetails",
          preserveNullAndEmptyArrays: true, // if you want to keep friends without user details
        },
      },
      {
        $project: {
          friendid: 0,
          userid: 0,
          _id: 0,
          __v: 0,
          friendDetails: { email: 0, password: 0, __v: 0, _id: 0 },
        },
      },
    ]);

    return res.status(200).json({ success: true, requests });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
};
const getIncomingRequests = async (req, res) => {
  const { myfriendid } = req.body;
  console.log(myfriendid);

  try {
    const requests = await Friend.aggregate([
      { $match: { $and: [{ friendid: myfriendid }, { status: "pending" }] } },
      {
        $lookup: {
          from: "users",
          localField: "userid",
          foreignField: "_id",
          as: "friendDetails",
        },
      },
      {
        $unwind: {
          path: "$friendDetails",
          preserveNullAndEmptyArrays: true, // if you want to keep friends without user details
        },
      },
      {
        $project: {
          friendid: 0,
          userid: 0,
          _id: 0,
          __v: 0,
          friendDetails: {
            email: 0,
            password: 0,
            __v: 0,
            _id: 0,
            refreshToken: 0,
          },
        },
      },
    ]);
    console.log(requests);

    return res.status(200).json({ success: true, requests });
  } catch (error) {
    throw new ApiError();
  }
};
const searchFriendById = async (req, res) => {
  const { friendid } = req.body;
  try {
    const user = await User.findOne({ gameid: friendid });
    if (!user){
      return res
      .status(400)
      .json(new ApiResponse(400,null,"No user found."));
    }
     
    return res.status(200).json({
      success: true,
      username: user.username,
      userid: user.gameid,
      profile: user.profile,
    });
  } catch (error) {
    throw new ApiError();
  }
};
const withdrawMyRequest = AsyncWrapper(async (req, res) => {
  const { id } = req.user;
  const { friendid } = req.body;
    const removeRequest = await Friend.deleteOne({
      userid: id,
      friendid: friendid,
    });
    if (removeRequest) {
      return res
        .status(200)
        .json(new ApiResponse(200, null, "Request Deleted Successfully."));
    }
    return res
      .status(400)
      .json(new ApiResponse(400, "Failed to delete request."));
 
});
const removeFromFriendList = AsyncWrapper(() => {
  throw new ApiError(
    400,
    "something went wrong during removing from friendlist"
  );
});

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendsList,
  getFriendRequest,
  searchFriendById,
  getIncomingRequests,
  withdrawMyRequest,
  removeFromFriendList,
};
