const express = require('express');
const {getAllPosts , createPost, getUserPosts} = require('../Controllers/post-controller')
const router = express.Router();

// router.get('/post',getPost)
// router.get('/posts/:postId', getPost);

router.get('/posts/user/:userId', getUserPosts);
router.get('/posts', getAllPosts);
router.post('/post',createPost)

module.exports = router