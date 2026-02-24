const express = require('express');
const { userAuth } = require('../middlewares/auth');
const paymentRouter = express.Router();
const razorpayInstance = require('../utils/razorpay')
const Payment = require('../models/payment');
const { membershipAmount } = require('../utils/constants');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const User = require('../models/user');

paymentRouter.post('/payment/create',userAuth,async(req,res)=>{
    try{
        const { membershipType } = req.body
        const { firstName, lastName, email } = req.user
        const order = await razorpayInstance.orders.create({
            amount: membershipAmount[membershipType] * 100, // in Paisa
            currency: "INR",
            receipt: "receipt#1",
            notes:{
                firstName,
                lastName,
                email,
                membershipType,
            }
        })
        const payment = new Payment({
            orderId: order.id,
            userId: req.user._id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes,
            status: order.status,

        })
        const savedPayment = await payment.save();
        res.json({...savedPayment.toJSON(), key: process.env.RAZORPAY_KEY_ID})
    }catch(err){
        res.status(400).send({message: err.message})
    }
})

paymentRouter.post('/payments/webhook',async (req,res)=>{
    try {
        const webhookSignature = req.headers("X-Razorpay-Signature")
        const isWebhookValid = validateWebhookSignature(
            JSON.stringify(req.body), 
            webhookSignature, 
            process.env.RAZORPAY_WEBHOOK_SECRET
        )
        if(!isWebhookValid){
            return res.status(400).json({ message : "Webhook Signature Invalid."})
        }

        // update my payment status in DB
        const paymentDetails = req.body.payload.payment.entity;

        const payment = await Payment.findOne({orderId: paymentDetails.order_id})
        payment.status = paymentDetails.status;
        await payment.save()

        // update the user as premium
        const user = await User.findOne({_id: payment.userId})
        user.isPremium = true;
        user.membershipType = payment.notes.membershipType
        await user.save()

        // return success response to razorpay
        
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
})

paymentRouter.get('/payment/verify',userAuth, async( req,res)=>{
    const user = req.user;
    if(user.isPremium){
        return res.json({isPremium: true})
    }else
        return res.json({isPremium: false})

})
module.exports = paymentRouter