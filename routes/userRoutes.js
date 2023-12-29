const express  = require('express');
const { userRegistration, loginUser } = require('../controller/userController');
const { signupVaildatorMiddleware } = require('../middleware/validatorMiddleware');
const router = express.Router();

router.post("/register-user",signupVaildatorMiddleware,userRegistration)
router.post("/login-user",loginUser)

module.exports = router;