const express = require('express')

const { userAuth } = require('../middlewares/auth')
const profileRouter = express.Router();


profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const { user } = req
    // console.log(user)
    res.send(user);
  } catch (err) {
    res.status(400).send("Profile fetching failed : " + err.message);
  }
});

module.exports = profileRouter