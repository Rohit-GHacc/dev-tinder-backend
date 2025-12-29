const express = require('express');
const ConnectionRequest = require('../models/connectionRequest');
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const { ConnectionStates } = require('mongoose');
const userRouter = express.Router();
const USER_SAFE_DATA = 'firstName lastName about skills gender age'
userRouter.get('/user/requests/received',userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        })
        .populate('fromUserId', USER_SAFE_DATA )
        res.json({
            message: `${loggedInUser.firstName}, following are your connection requests`,
            data: connectionRequests
        });
    }catch(err){
        res.status(400).send('Error : ' + err.message)
    }
})

userRouter.get('/user/connections', userAuth, async (req,res) =>{
    try{
        const loggedInUser = req.user;
        const accepted_connection_requests = await ConnectionRequest.find({
            $or: [{
                toUserId: loggedInUser._id,
                status: 'accepted'
            }, {
                fromUserId: loggedInUser._id,
                status: 'accepted'
            }]
        })
        .populate("toUserId",USER_SAFE_DATA) // both are same
        .populate('fromUserId',USER_SAFE_DATA) // both are same 
        const connections = accepted_connection_requests.map( acr => {
            if(acr.toUserId._id.toString() === loggedInUser._id.toString()){
                return acr.fromUserId
            }
            return acr.toUserId
        })
        res.json({message:`${loggedInUser.firstName}, following are your connections.`, data: connections})

    }
    catch(err){
        res.status(400).send({message: err.message})
    }
})

userRouter.get('/user/feed',userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;
        // user should not see
        // 1. his own profile
        // 2. connections
        // 3. ignored people
        // 4. already sent connection requests
        const connections = await ConnectionRequest.find({
            $or: [{toUserId: loggedInUser._id},{fromUserId: loggedInUser._id}]
        }).select('fromUserId toUserId')
        // console.log(connections)
        // .populate('fromUserId','firstName lastName')
        // .populate('toUserId','firstName lastName')
        const non_feed_users = new Set();
        // non_feed_users.add('abcd')
        // console.log(non_feed_users)
        connections.forEach( c => {
            non_feed_users.add(c.fromUserId.toString())
            non_feed_users.add(c.toUserId.toString())
            // console.log(c.fromUserId.toString())
        })
        const feed = await User.find({
            $and: [
                { _id : { $nin : [ ...non_feed_users ] } }, 
                { _id: { $ne : loggedInUser._id } }
            ]
        })
        .select(USER_SAFE_DATA)
        res.json({data: feed})
    }
    catch(err){
        res.status(400).json({
            message: err.message
        })
    }
})
module.exports = userRouter