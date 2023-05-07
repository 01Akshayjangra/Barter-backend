const express = require('express');
const {getAllPosts , createPost, getUserPosts, likePost, unlikePost, sharePost, deletePost, getSomeonesUserPosts, getRecommendations} = require('../controllers/postController')
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");


router.get('/posts/user',protect,getUserPosts);
router.get('/posts',getAllPosts);

router.post('/post',protect,createPost)

router.put('/like',protect,likePost)
router.put('/unlike',protect,unlikePost)
router.put('/share',protect,sharePost)

router.delete('/',protect,deletePost)

router.post('/posts/getSomeonesUserPosts',getSomeonesUserPosts)

router.post('/get/recommendations',getRecommendations)

module.exports = router