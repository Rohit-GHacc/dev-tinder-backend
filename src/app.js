const express = require("express");
const db = require("./config/database");
const app = express();

// EXPORTED connectDB FROM database.js AND CHANGED THE VARIABLE NAME TO db  AND STILL WORKED
db().then(() => {
    console.log('Connected to database successfully')
    app.listen(7777, () => {
        console.log("Server running on port 7777 successfully.");
    });
});
