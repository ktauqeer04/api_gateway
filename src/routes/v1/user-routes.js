const express = require('express');
const router = express.Router();
const { AuthMiddleware } = require('../../middlewares');
const { UserController } = require('../../controllers');


router.post('/signin', AuthMiddleware.validateAuthRequest, UserController.signIn);
router.post('/signup', AuthMiddleware.validateAuthRequest, UserController.signUp);
router.post('/role', AuthMiddleware.checkAuth, AuthMiddleware.isAdmin, UserController.addrole);

module.exports = router