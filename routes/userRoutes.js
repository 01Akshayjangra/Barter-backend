const express = require('express');
const { authUser, registerUser, userProfile, allUsers } = require('../controllers/userControllers');
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.route('/').post(registerUser).get(protect,allUsers);
router.post('/login',authUser);

router.get('/info',protect,userProfile)



module.exports = router
