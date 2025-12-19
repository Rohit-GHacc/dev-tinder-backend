const express = require('express')
const app = express()
const { userAuth, adminAuth } = require('./utils/middleware')

app.get('/admin', adminAuth,(req,res)=>{
    res.send('Admin Authorized.')
})


app.use('/user', userAuth)
app.get('/user',
    (req,res,next)=>{
        console.log('First route handler')
        // res.send('Response 1')
        next();
    },
    // ARRAY ME BHI DAAL SAKTE HAIN INKO
    [(req,res,next)=>{
        console.log('Second route handler')
        next()
        // res.send('Response 2')
    },
    (req,res,next)=>{
        console.log("Third route handler")
        // res.send('Response 3')
        next()
    }]
)

// below code is never getting executed because response is sent above only
app.get('/user',(req,res,next)=>{
    // try{ 
        throw new Error(' HAHAHAHAHA ')
    //     res.send('Response 4')
    // }
    // catch(err){
    //     res.status(500).send('Something went wrong. HAHAHA')
    // }
    // res.send('Response 4')
})
// USE BELOW ROUTE IN LAST EVERYTIME BECAUSE '/' ROUTE MATCHES EVERY ROUTE POSSIBLE
// WILDCARD ERROR HANDLING
app.use('/',(err,req,res,next)=>{
    if(err){
        // console.log(err)
        res.status(500).send('Something went wrong. ')
    }else
    res.send('Home page')
})
app.listen(7777,()=>{
    console.log('Server running on port 7777 successfully.')
})