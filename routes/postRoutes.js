const express = require('express');
const verifyToken  = require('../middleware/auth')
const {getAllPosts , createPost, getUserPosts} = require('../controllers/postController')
const router = express.Router();


router.get('/posts/user/',verifyToken, getUserPosts);
router.get('/post', getAllPosts);
router.post('/post',verifyToken,createPost)

module.exports = router