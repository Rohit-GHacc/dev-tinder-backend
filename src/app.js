const express = require('express')
const app = express()

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
        next();
    }]
)
app.get('/user',(req,res,next)=>{
    res.send('Response 4')
})
// USE BELOW ROUTE IN LAST EVERYTIME BECAUSE '/' ROUTE MATCHES EVERY ROUTE POSSIBLE
// app.use('/',(req,res)=>{
//     res.send('Home page')
// })
app.listen(7777,()=>{
    console.log('Server running on port 7777 successfully.')
})