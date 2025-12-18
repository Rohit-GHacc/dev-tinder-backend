const express = require('express')
const app = express()


// app.use(function(req,res){
//     res.send('response sent')
// })

// THIS WILL MATCH TO ALL API HTTP METHODS LIKE GET POST PATCH
app.use('/hello/hi',(req,res)=>{
    res.send("Hi Rohit")
})
app.use('/hello',(req,res)=>{
    res.send('Hello Rohit')
})

app.get('/user',(req,res)=>{
    res.send('Got USER')
})

app.post('/user',(req,res)=>{
    console.log(req.query)
    res.send("Request query ")
})

app.get('/user/:name/:password',(req,res)=>{
    console.log(req.params)
    res.send('PARAMS ADDED')
})

app.post('/user',(req,res)=>{
    res.send('POST REQUEST SENT')
})

// USE BELOW ROUTE IN LAST EVERYTIME BECAUSE '/' ROUTE MATCHES EVERY ROUTE POSSIBLE
app.use('/',(req,res)=>{
    res.send('Home page')
})
app.listen(7777,()=>{
    console.log('Server running on port 7777 successfully.')
})