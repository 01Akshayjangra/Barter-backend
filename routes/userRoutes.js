const express = require('express');
const { authUser, registerUser, userProfile, allUsers, profileImage, profileBanner, followUser,unFollowUser,anotherUser, userAbout, getUserAbout, uniqueName, googleAuth, CheckFollow} = require('../controllers/userControllers');
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.route('/').post(registerUser).get(protect,allUsers)
router.post('/login',authUser);

router.post('/google-auth',googleAuth);

router.put('/profileImage',protect,profileImage);
router.put('/profileBanner',protect,profileBanner);


router.get('/profile',protect,userProfile)

router.put('/follow/:userId', protect,followUser)
router.put('/unfollow/:userId', protect,unFollowUser)

router.get('/CheckFollow/:userId', protect,CheckFollow)

router.post('/about',protect,userAbout)
router.get('/about',protect,getUserAbout)

router.get('/check-unique-name',uniqueName);

router.get('/anotherUser',anotherUser)
// router.post('/recommendations',postRecommendations)



module.exports = router
