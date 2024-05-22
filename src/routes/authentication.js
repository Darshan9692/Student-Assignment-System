const express = require('express');
const { register, loginUser, logout } = require('../controllers/authentication');
const { isAuthenticatedUser } = require('../services/auth');

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/auth").get(isAuthenticatedUser);

module.exports = router;