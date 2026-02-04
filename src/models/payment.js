const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    paymentId:{
        type: String
    },
    orderId: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    notes:{
        firstName:{
            type: String,
            required: true
        },
        lastName:{
            type:String,
            required: true
        },
        membershipType:{
            type: String,
            required: true
        }
    },
    receipt: {
        type: String,
        required: true
    },
    status:{
        type: String
    }

},{
    timestamps: true
})

module.exports = mongoose.model("Payment", paymentSchema)