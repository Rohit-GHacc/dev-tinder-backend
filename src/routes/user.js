const express = require('express');
const ConnectionRequest = require('../models/connectionRequest');
const { userAuth } = require('../middlewares/auth');
const userRouter = express.Router();

userRouter.get('/user/requests/received',userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        })
        .populate('fromUserId', 'firstName lastName about skills gender')
        res.json({
            message: "Following are your connection requests",
            data: connectionRequests
        });
    }catch(err){
        res.status(400).send('Error : ' + err.message)
    }
})

module.exports = userRouter