const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../model/User')

const createUser = async (req, res) => {
  try {
    const { name, email, phone, password, } = req.body;
    if (!(email && password && name)) {
      res.status(400).send("All input is required");
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    encryptedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name: name.toUpperCase(),
      email: email.toLowerCase(),
      phone: phone,
      password: encryptedPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );
    user.token = token;
    await user.save();
    res.status(201).json({ message: "User Created" });
  } catch (err) {
    console.log(err);
  }
}

const loginUser = async (req, res) => {
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
          expiresIn: "2h",
        }
      );
      user.token = token;
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

}

const logOut = async (req, res) => {
  if(req.session){
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error logging out');
      } else {
        res.clearCookie('connect.sid', { path: '/' });
        res.status(200).send('Logged out');
      }
    });
  }

}

module.exports = {
  createUser,
  loginUser,
  logOut

};