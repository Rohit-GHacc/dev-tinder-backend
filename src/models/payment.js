const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
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
        type: Object,
        required: true
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