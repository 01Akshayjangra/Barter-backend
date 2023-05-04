const express = require('express');
const { authUser, registerUser, userProfile, allUsers, profileImage, followUser,unFollowUser } = require('../controllers/userControllers');
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
//-----> /api/user
router.route('/').post(registerUser).get(protect,allUsers).put(protect,profileImage);
router.post('/login',authUser);


router.get('/info',protect,userProfile)


router.post('/follow/:id',protect,followUser)
router.post('/unfollow/:id',protect,unFollowUser)


module.exports = router
