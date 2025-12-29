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
        .populate("toUserId","firstName lastName skills about gender age")
        .populate('fromUserId',['firstName', 'lastName', 'skills', 'about', 'gender', 'age'])
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

module.exports = userRouter