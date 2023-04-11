const express = require('express');
const { loginUser, createUser,logOut } = require('../Controllers/user-controller');
const router = express.Router();

router.post('/register',createUser)
router.post('/login',loginUser)
router.post('/logout',logOut)

module.exports = router