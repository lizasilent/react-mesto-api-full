/* eslint-disable no-console */
/* eslint-disable linebreak-style */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request');
const Unauthorized = require('../errors/unauthorized');
const ConflictError = require('../errors/conflict-error');

const { NODE_ENV, JWT_SECRET } = process.env;

// Получить информацию о себе
const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(200).send({ data: user });
    })
    .catch(next);
};

// Получить список всех юзеров
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Запрашиваемый файл не найден');
      }

      res.status(200).send(users);
    })
    .catch(next);
};

// Получить одного юзера по id
const getUserProfile = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Данные не прошли валидацию'));
      }
      next(err);
    });
};

// Создать юзера
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(200).send({ mail: user.email }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequest(`Данные не прошли валидацию${err}`);
      }
      if (err.name === 'MongoError' || err.code === '11000') {
        throw new ConflictError('Такой email уже зарегистрирован');
      }
    })
    .catch(next);
};

// Обновить инфо юзера;
const updateUserInfo = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id,
    { name: req.body.name, about: req.body.about }, { runValidators: true })
    .then((user) => {
      if (!user) {
        throw new BadRequest('Ошибка при обновлении информации пользователя');
      }
      res.status(200).send({ data: user });
    })
    .catch(next);
};

// Обновить аватар
const updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id,
    { avatar: req.body.avatar }, { runValidators: true })
    .then((user) => {
      if (!user) {
        throw new BadRequest('Ошибка при обновлении аватара');
      }
      res.status(200).send({ data: user });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch(() => {
      throw new Unauthorized('Авторизация не пройдена');
    })
    .catch(next);
};

module.exports = {
  getMe,
  login,
  createUser,
  getUsers,
  getUserProfile,
  updateUserInfo,
  updateAvatar,
};
