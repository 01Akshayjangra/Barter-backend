const express = require('express');
const {getAllPosts , createPost, getUserPosts, likePost, unlikePost, sharePost, deletePost,getUserPostsNew} = require('../controllers/postController')
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");


router.get('/posts/user/',protect,getUserPosts);
router.get('/posts',getAllPosts);
router.get('/allpost',getUserPostsNew);

router.post('/post',protect,createPost)
router.put('/like',protect,likePost)
router.put('/unlike',protect,unlikePost)
router.put('/share',protect,sharePost)
router.delete('/',protect,deletePost)
module.exports = router