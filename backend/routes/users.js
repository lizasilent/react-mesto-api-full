/* eslint-disable linebreak-style */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMe,
  getUsers,
  getUserProfile,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getMe);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUserProfile);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^https?:\/\/(www\.)?([a-zA-Z0-9-])+\.([a-zA-Z])+\/?([a-zA-Z0-9\-_~:/#[\]@!&â€™,;=]+)/),
  }),
}), updateAvatar);

module.exports = router;
