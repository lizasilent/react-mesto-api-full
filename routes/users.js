/* eslint-disable linebreak-style */
const router = require('express').Router();
const {
  getUsers, getUserProfile, updateUserInfo, updateAvatar,
} = require('../controllers/users');
const { getLoginData } = require('../controllers/login');

router.get('/users', getUsers);
router.get('/users/:id', getUserProfile);
router.get('/users/me', getLoginData);
router.patch('/users/me', updateUserInfo);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
