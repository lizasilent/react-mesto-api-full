/* eslint-disable linebreak-style */
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request');

// Получить список всех юзеров
const getUsers = (req, res, next) => User.find({})
  .then((users) => {
    if (!users) {
      throw new NotFoundError('Запрашиваемый файл не найден');
    }

    res.status(200).send(users);
  })
  .catch(next);

// Получить одного юзера по id
const getUserProfile = (req, res, next) => User.findOne({ _id: req.params.id })
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id');
    }
    res.status(200).send(user);
  })
  .catch(next);

// Создать юзера
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => User.create({
    name, about, avatar, email, password: hash,
  }))
    .then((user) => {
      if (!user) {
        throw new BadRequest('Ошибка создания пользователя');
      }
      res.status(200).send(user);
    })
    .catch(next);
};

// Обновить инфо юзера;
const updateUserInfo = (req, res, next) => User.findByIdAndUpdate(req.user._id,
  { name: req.body.name, about: req.body.about }, { runValidators: true })
  .then((user) => {
    if (!user) {
      throw new BadRequest('Ошибка при обновлении информации пользователя');
    }
    res.status(200).send({ data: user });
  })
  .catch(next);

// Обновить аватар
const updateAvatar = (req, res, next) => User.findByIdAndUpdate(req.user._id,
  { avatar: req.body.avatar }, { runValidators: true })
  .then((user) => {
    if (!user) {
      throw new BadRequest('Ошибка при обновлении аватара');
    }
    res.status(200).send({ data: user });
  })
  .catch(next);

module.exports = {
  getUsers, getUserProfile, createUser, updateUserInfo, updateAvatar,
};
