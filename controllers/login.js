/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Получить одного юзера по id
const getLoginData = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
    // создадим токен
      const token = jwt.sign({ _id: user._id }, { expiresIn: '7d' });

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      // ошибка аутентификации
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports = {
  getLoginData,
};
