const express = require('express')
const app = express()


// app.use(function(req,res){
    //     res.send('response sent')
    // })
app.use('/hello',(req,res)=>{
    res.send('Hello Rohit')
})
    
app.use('/',(req,res)=>{
    res.send('Home page')
})
app.listen(7777,()=>{
    console.log('Server running on port 7777 successfully.')
})