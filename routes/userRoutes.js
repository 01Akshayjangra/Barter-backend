const express = require('express');
const { authUser, registerUser, userProfile, allUsers, profileImage, followUser,unFollowUser,anotherUser, userAbout, getUserAbout, someonesProfile} = require('../controllers/userControllers');
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.route('/').post(registerUser).get(protect,allUsers)
router.post('/login',authUser);
router.put('/profileImage',protect,profileImage);


router.get('/profile',protect,userProfile)
router.post('/follow',protect,followUser)
router.post('/unfollow',protect,unFollowUser)
router.post('/about',protect,userAbout)
router.get('/about',protect,getUserAbout)
router.get('/someonesProfile',someonesProfile)

router.get('/anotherUser',anotherUser)
// router.post('/recommendations',postRecommendations)



module.exports = router
