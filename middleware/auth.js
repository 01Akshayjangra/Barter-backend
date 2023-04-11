const jwt = require("jsonwebtoken");
const config = process.env;
const cors = require("cors");
const corsOptions = {
  origin: "https://barter-one.vercel.app", // replace with your frontend domain
  credentials: true, // enable cookies and credentials
};

const verifyToken = (req, res, next) => {
  cors(corsOptions)(req, res, () => {});


  const token = req.cookies.authToken;
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.SECRET_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;