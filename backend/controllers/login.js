/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Unauthorized = require('../errors/unauthorized');

// Получить одного юзера по id
const getLoginData = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Ошибка авторизации');
      }
      // создадим токен
      const token = jwt.sign({ _id: user._id }, { expiresIn: '7d' });
      // вернём токен
      res.status(200).send({ token });
    })
    .catch(next);
};

module.exports = {
  getLoginData,
};
