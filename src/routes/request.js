const express = require('express')
const requestRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const { Connection } = require('mongoose');
// requestRouter.get("/getUser", async (req, res) => {
//   try {
//     const user = await User.find({ email: req.body.email });
//     res.send(user);
//   } catch (err) {
//     res.status(400).send("Something went wrong.");
//   }
// });
requestRouter.post('/request/send/:status/:toUserId', userAuth, async(req,res)=>{
  try{
    const toUserId = req.params.toUserId;
    const fromUserId = req.user._id;
    const status = req.params.status;
    console.log(toUserId, fromUserId);
    // validations : 
    // A->B and B->A both are same so can't send again
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or : [ { fromUserId, toUserId}, { fromUserId: toUserId, toUserId: fromUserId}]
    })
    if(existingConnectionRequest){
      return res.status(400).send("Connection request already exists.")
    }
    // users should exist in the DB
    const toUser = await User.findById(toUserId)
    if(!toUser){
      return res.status(400).send("User doesn't exist.")
    }
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    })

    const data = await connectionRequest.save();
    res.json({
      message: "Request sent successfully",
      data
    })
  }
  catch(err){
    res.status(400).send("ERROR: " + err.message)
  }
})

module.exports = requestRouter