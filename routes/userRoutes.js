const express = require('express');
const { authUser, registerUser, userProfile, allUsers, profileImage, followUser,unFollowUser, userAbout, getUserAbout} = require('../controllers/userControllers');
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.route('/').post(registerUser).get(protect,allUsers).put(protect,profileImage);
router.post('/login',authUser);


router.get('/profile',protect,userProfile)
router.post('/follow',protect,followUser)
router.post('/unfollow',protect,unFollowUser)
router.post('/about',protect,userAbout)
router.get('/about',protect,getUserAbout)


module.exports = router
