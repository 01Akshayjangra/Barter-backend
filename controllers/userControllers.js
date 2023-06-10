const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/userModel')
const Post = require('../models/postModel')
const About = require('../models/aboutModel')
const EmailVerification = require("../models/EmailVerification")
const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const cloudinary = require('../utils/cloudinary');
// const { v4: uuidv4 } = require("uuid");
// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "Gmail", // Specify your email service provider
//   auth: {
//     user: "barter99888@gmail.com", // Enter your email address
//     pass: "BarterGoogle@2002", // Enter your email password
//   },
// });

//@description Register new user 
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    pic: {
      public_id: 'default',
      url: pic,
    },
  });



  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
      followers: '0',
      following: '0',
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});


//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

//@description     Authenticate user with Google
//@route           POST /api/google-auth
//@access          Public
const googleAuth = async (req, res) => {
  const { name, email, password, pic } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists, generate token and send it in the response
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    }

    // User does not exist, create a new user
    user = new User({
      name,
      email,
      password, // Store the Google providerData[0].uid as the password
      pic: {
        public_id: 'default',
        url: pic,
      },
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // Save the new user to the database
    await user.save();

    // Generate token and send it in the response
    const token = generateToken(user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const userProfile = async (req, res) => {

  const user = await User.findOne(req.user._id);

  if (user) {
    res.json({
      // _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      banner: user.banner,
      // followers,
      // following,
      // token: generateToken(user._id),
    })

  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
}

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {

  const keyword = req.query.search ? {
    $or: [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
    ],
  }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

const profileImage = asyncHandler(async (req, res) => {
  const { pic } = req.body;
  try {
    const result = await cloudinary.uploader.upload(pic, {
      folder: "userAvatars",
    })
    console.log(result)

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        pic: {
          public_id: result.public_id,
          url: result.secure_url
        }
      })
    res.status(201).json({
      success: true,
      user
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const profileBanner = asyncHandler(async (req, res) => {
  const { banner } = req.body;
  try {
    const result = await cloudinary.uploader.upload(banner, {
      folder: "userBanners",
    })
    console.log(result)

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        banner: {
          public_id: result.public_id,
          url: result.secure_url
        }
      })
    res.status(201).json({
      success: true,
      user
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Follow a user
const followUser = async (req, res) => {
  console.log("gidi");
  const userId = req.user._id; // get the ID of the logged in user
  const { followUserId } = req.body; // get the ID of the user to follow

  try {
    // Add the followUserId to the followers array of the logged in user
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { following: followUserId } },
      { new: true }
    );

    // Add the logged in user's ID to the following array of the user being followed
    const followUser = await User.findByIdAndUpdate(
      followUserId,
      { $addToSet: { followers: userId } },
      { new: true }
    );

    res.status(200).json({ message: 'User followed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error following user' });
  }
};

// Unfollow a user
const unFollowUser = async (req, res) => {
  const userId = req.user._id; // get the ID of the logged in user
  const { unfollowUserId } = req.body; // get the ID of the user to unfollow

  try {
    // Remove the unfollowUserId from the followers array of the logged in user
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { following: unfollowUserId } },
      { new: true }
    );

    // Remove the logged in user's ID from the following array of the user being unfollowed
    const unfollowUser = await User.findByIdAndUpdate(
      unfollowUserId,
      { $pull: { followers: userId } },
      { new: true }
    );

    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error unfollowing user' });
  }
};

const userAbout = async (req, res) => {
  try {
    const { firstname, lastname, occupation, company, country, city, title, description } = req.body;
    const userId = req.user.id;

    let about = await About.findOne({ userId });

    if (!about) {
      // create new about data
      about = new About({
        firstname,
        lastname,
        occupation,
        company,
        country,
        city,
        title,
        description,
        userId
      });
    } else {
      // update existing about data
      about.firstname = firstname;
      about.lastname = lastname;
      about.occupation = occupation;
      about.company = company;
      about.country = country;
      about.city = city;
      about.title = title;
      about.description = description;
    }

    const savedAbout = await about.save();
    res.json(savedAbout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving About data' });
  }
};

// Route to fetch user about data -- api/user/about
const getUserAbout = async (req, res) => {
  try {
    const userId = req.user.id;

    const aboutData = await About.findOne({ userId });

    if (!aboutData) {
      return res.status(404).json({ message: 'User about data not found' });
    }

    // Return the about data in the response
    res.json(aboutData);
  } catch (error) {
    console.error('Error fetching user about data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Routes ------------- For user whose profile is viewed by someone

const someonesProfile = async (req, res) => {
  // const {userId} = req.body; // Assuming the user ID is sent in the request body
  const userId = req.query.userId;
  const user = await User.findOne({ _id: userId });
  console.log(userId);
  if (user) {
    res.json({
      name: user.name,
      email: user.email,
      pic: user.pic
    });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};

const anotherUser = async (req, res) => {
  const userId = req.query.userId;
  const user = await User.findOne({ _id: userId });
  console.log(userId);
  if (user) {
    res.json({
      name: user.name,
      email: user.email,
      pic: user.pic
    });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};
// Uinque name checking
const uniqueName = async (req, res) => {
  try {
    const { name } = req.query;
    const existingUser = await User.findOne({ name: { $regex: `^${name}$` } });

    if (existingUser) {
      return res.json({ available: false });
    }

    return res.json({ available: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  authUser,
  userProfile,
  allUsers,
  profileImage,
  profileBanner,
  followUser,
  unFollowUser,
  userAbout,
  getUserAbout,
  someonesProfile,
  anotherUser,
  uniqueName,
  googleAuth
};