const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageControllers");
// const { protect } = require("../middleware/authMiddleware");
const verifyToken  = require('../middleware/auth')
const router = express.Router();

router.route("/:chatId").get(verifyToken, allMessages);
router.route("/").post(verifyToken, sendMessage);

module.exports = router;
