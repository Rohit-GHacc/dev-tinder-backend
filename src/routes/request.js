const express = require('express')
const requestRouter = express.Router();
const User = require("../models/user");

requestRouter.get("/getUser", async (req, res) => {
  try {
    const user = await User.find({ email: req.body.email });
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong.");
  }
});

module.exports = requestRouter