const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/userModel')
const Post = require('../models/postModel')
const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");

//@description     Register new user 
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password, pic } = req.body;

  if (!name || !phone || !email || !password) {
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
    phone,
    pic,
  });

  if (user) {
    const token = generateToken(user._id)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: token,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});


//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
// const authUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if (user && (await user.matchPassword(password))) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//       pic: user.pic,
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(401);
//     throw new Error("Invalid Email or Password");
//   }
// });
const authUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.SECRET_KEY,
        {
          expiresIn: "7h",
        }
      );
      user.token = token;
      console.log("hello",token)
      res.cookie("authToken", token, {
        httpOnly: true,
        expires: new Date(new Date().getTime() + 20 * 60 * 1000),
      });
      console.log("login ho gya");
      res.status(200).json(user);
    }
    else {
      if (!res.headersSent) { // check if headers have been sent before
        res.status(400).send("Invalid Credentials");
      }
    }
  } catch (err) {
    console.log(err);
    if (!res.headersSent) { // check if headers have been sent before
      res.status(500).send("Internal Server Error");
    }
  }
});


const logOut = async (req, res) => {
  console.log("hdhhddd");
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error logging out');
      } else {
        // res.clearCookie('authToken', { path: '/' });
        res.status(200).send('Logged out');
      }
    });
  }

}

const userProfile = async (req, res) => {
  const userId = req.query.id;
  const posts = await Post.find({ userId });
  res.json(posts);
}

// /api/user?search=piyush
const allUsers = async () => {
  const keyword = req.query.search ? {
    $or: [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } }
    ]
  }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
  res.send(users);

};

module.exports = {
  registerUser,
  authUser,
  logOut,
  userProfile,
  allUsers,
};