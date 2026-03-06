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
        // save it in database
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
        // return back my order details to frontend
        res.json({...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID})
    }catch(err){
        res.status(400).send({message: err.message})
    }
})

paymentRouter.post('/payment/webhook',async (req,res)=>{
    try {
        console.log('webhook called')
        const webhookSignature = req.headers["X-Razorpay-Signature"]
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
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        payment.status = paymentDetails.status;
        await payment.save()
        if (req.body.event !== "payment.captured") {
            return res.status(200).json({ message: "Event ignored" });
        }
        // update the user as premium
        const user = await User.findOne({_id: payment.userId})
        console.log(user)
        user.isPremium = true;
        user.membershipType = payment.notes.membershipType
        await user.save()

        // if (req.body.event == "payment.captured") {
        // }
        // if (req.body.event == "payment.failed") {
        // }
        // return success response to razorpay
        
        return res.status(200).json({ msg: "Webhook received successfully" });
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
})

paymentRouter.get('/premium/verify', userAuth, async( req,res)=>{
    const user = req.user;
    console.log(user);
    if(user.isPremium){
        return res.json({isPremium: true})
    }else
        return res.json({isPremium: false})

})
module.exports = paymentRouter