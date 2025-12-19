const mongoose = require('mongoose')

const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://Rohit:devtinder@cluster0.nokyvlh.mongodb.net/devTinder')
}

module.exports = connectDB;