const express = require('express');
// const verifyToken  = require('../middleware/auth')
const {getAllPosts , createPost, getUserPosts} = require('../controllers/postController')
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");


router.get('/posts/user/',protect, getUserPosts);
router.get('/post', getAllPosts);
router.post('/post',protect,createPost)

module.exports = router