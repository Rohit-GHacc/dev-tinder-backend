const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();
const { validateEditFields } = require("../utils/validation");
const User = require("../models/user");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const { user } = req;
    // console.log(user)
    res.send(user);
  } catch (err) {
    res.status(400).send("Profile fetching failed : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    console.log("Validation started.");
    validateEditFields(req);
    // else throw new Error('Not Valid request.')
    const loggedInUser = req.user;
    const updatedProfile = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { returnDocument: "after" },
    );
    console.log(updatedProfile);
    updatedProfile.save();
    res.send(updatedProfile);
  } catch (err) {
    res.status(400).send("Error while updating the profile : " + err.message);
  }
});

profileRouter.post(
  "/profile/upload",
  upload.array("images",5),
  userAuth,
  async (req, res) => {
    try {
      if (!req.files) {
        return res.status(400).send("No file uploaded");
      }
      // console.log(req.file);
      // const result = await cloudinary.uploader.upload(req.file.path);
      // console.log(result.secure_url);
      // const updatedProfile = await User.findByIdAndUpdate(
      //   req.user._id,
      //   { photoURL: result.secure_url },
      //   { returnDocument: "after" },
      // );
      // res.json(updatedProfile);

      const uploadPromises = req.files.map(file =>{
        return new Promise((resolve, reject)=>{
          cloudinary.uploader.upload_stream({folder: 'devhub'},(error, result)=>{
            if(error) reject(error)
            else resolve(result.secure_url)
          })
          .end(file.buffer)
        })
      })
      const imageUrls = await Promise.all(uploadPromises);
      res.json({
        success: true,
        images: imageUrls
      })
    } catch (err) {
      console.error(err)
      res.status(500).send("Error while uploading the image : " + err.message);
    }
  },
);

module.exports = profileRouter;
