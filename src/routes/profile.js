const express = require('express')
const { userAuth } = require('../middlewares/auth')
const profileRouter = express.Router();
const {validateEditFields} = require('../utils/validation')
const User = require('../models/user')
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const { user } = req
    // console.log(user)
    res.send(user);
  } catch (err) {
    res.status(400).send("Profile fetching failed : " + err.message);
  }
});

profileRouter.patch('/profile/edit',userAuth, async (req,res)=>{
  try{
    console.log('Validation started.')
    validateEditFields(req)
    // else throw new Error('Not Valid request.')
    const loggedInUser = req.user
    const updatedProfile = await User.findByIdAndUpdate(req.user._id,req.body,{ returnDocument:'after'})
    console.log(updatedProfile)
    updatedProfile.save();
    res.send(updatedProfile)

  }
  catch(err){
    res.status(400).send('Error while updating the profile : ' + err.message)
  }
})

module.exports = profileRouter