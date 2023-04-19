const express = require('express');
const {getAllPosts , createPost, getUserPosts} = require('../Controllers/post-controller')
const router = express.Router();
// const fetchuser = require('../middleware/fetchuser');

router.get('/post/user/:id', getUserPosts);
router.get('/post', getAllPosts);
router.post('/post',createPost)

module.exports = router