const express = require("express");
const db = require("./config/database");
const User = require("./models/user");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')
const userRouter = require('./routes/user')
require('dotenv').config()
const paymentRouter = require('./routes/payment')
const cors = require('cors')
// CONVERTS JSON OBJECT TO JAVASCRIPT OBJECT
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:[
      'https://dev-tinder-frontend-ashen.vercel.app',
      'http://localhost:5173'
    ],
    credentials: true
}))

app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',requestRouter)
app.use('/',userRouter)
app.use('/',paymentRouter)
// DON'T FORGET TO USE ASYNC AWAIT
// app.get("/feed", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.send(users);
//   } catch (err) {
//     res.status(400).send("Something went wrong.");
//   }
// });



// // DELETING USER API
// app.delete("/deleteUser", async (req, res) => {
//   try {
//     // console.log(req.body.id)
//     const user = await User.findByIdAndDelete(req.body.id);
//     console.log(user);
//     res.send("User deleted successfully");
//   } catch (err) {
//     res.status(400).send("Something went wrong.");
//   }
// });

// // UPDATING USING ID IN REQ.PARAMS, REMEMBER TO CHANGE ROUTE FOR PARAMS AS THEY ARE PART OF URL
// app.patch("/updateUser/:id", async (req, res) => {
//   try {
//     const ALLOWED_FIELDS = ["skills", "age", "gender", "about", "password"];
//     const isAllowed = Object.keys(req.body).every((key) =>
//       ALLOWED_FIELDS.includes(key)
//     );
//     if (!isAllowed) {
//       throw new Error("You cannot update these fields.");
//     }
//     // console.log(req.body)
//     const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//       returnDocument: "after",
//       runValidators: true,
//     }); // by default it's before
//     console.log(user);
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     res.send("User updated successfully.");
//   } catch (err) {
//     res.status(400).send("UPDATE FAILED. " + err.message);
//   }
// });

// app.patch("/updateUserWithEmail", async (req, res) => {
//   try {
//     const user = await User.findOneAndUpdate(
//       { email: req.body.email },
//       req.body,
//       { runValidators: true }
//     );
//     res.send("User updated successfully.");
//   } catch (err) {
//     res.status(400).send("Update failed." + err.message);
//   }
// });

app.use((req, res) => {
  res.send("Hi Rohit");
});

// EXPORTED connectDB FROM database.js AND CHANGED THE VARIABLE NAME TO db  AND STILL WORKED
db()
  .then(() => {
    console.log("Connected to database successfully");
    app.listen(process.env.PORT || 7777, () => {
      console.log("Server running on port 7777 successfully.");
    });
  })
  .catch((err) => {
    console.error("Database connection failed :(" + err.message);
  });
