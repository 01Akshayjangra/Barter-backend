const express = require('express');
const verifyToken  = require('../middleware/auth')
const {getAllPosts , createPost, getUserPosts} = require('../Controllers/post-controller')
const router = express.Router();

// router.get('/post',getPost)
// router.get('/posts/:postId', getPost);

router.get('/posts/user/',verifyToken, getUserPosts);
router.get('/post', getAllPosts);
router.post('/post',verifyToken,createPost)

module.exports = router