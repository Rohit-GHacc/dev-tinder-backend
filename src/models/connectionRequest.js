const mongoose = require('mongoose')

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User"
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status:{
        type: String,
        enum:{
            values: ["interested", "ignored", "accepted", "rejected"],
            message: "{VALUE} is not a valid value"
        }
    }
},{
    timestamps: true
})

connectionRequestSchema.pre("save", async function() {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Good try... You cannot send request to yourself.");
  }
});


connectionRequestSchema.index({fromUserId: 1, toUserId: 1})
const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema)
module.exports = ConnectionRequest