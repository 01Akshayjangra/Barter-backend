const express = require('express');
const { authUser, registerUser, userProfile, allUsers, profileImage } = require('../controllers/userControllers');
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.route('/').post(registerUser).get(protect,allUsers).put(protect,profileImage);
router.post('/login',authUser);


router.get('/info',protect,userProfile)



module.exports = router
