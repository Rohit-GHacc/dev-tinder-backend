const express = require('express');
const { userAuth } = require('../middlewares/auth');
const paymentRouter = express.Router();
const razorpayInstance = require('../utils/razorpay')
const Payment = require('../models/payment')

paymentRouter.post('/payment/create',userAuth,async(req,res)=>{
    try{
        const order = await razorpayInstance.orders.create({
            amount: 70000,
            currency: "INR",
            receipt: "receipt#1",
            notes:{
                firstName: "firstName",
                lastName: "lastName",
                membershipType: "Silver"
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
        res.json({...savedPayment.toJSON()})
    }catch(err){
        res.status(400).send({message: err.message})
    }
})
module.exports = paymentRouter