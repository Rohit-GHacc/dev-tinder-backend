const express = require('express');
const { userAuth } = require('../middlewares/auth');
const paymentRouter = express.Router();
const razorpayInstance = require('../utils/razorpay')
const Payment = require('../models/payment');
const { membershipAmount } = require('../utils/constants');

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
module.exports = paymentRouter