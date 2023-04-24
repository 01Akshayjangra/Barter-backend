const express = require('express');
const { authUser, registerUser, logOut,userProfile, allUsers } = require('../controllers/userControllers');
const router = express.Router();

router.post('/register',registerUser)
router.post('/login',authUser)   
router.get('/logout',logOut)
router.get('/user',userProfile)
router.get('/alluser',allUsers)

module.exports = router
