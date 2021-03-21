/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */

const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequest = require('../errors/bad-request');

// Получить список всех карточек
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Запрашиваемый файл не найден');
      }

      res.status(200).send(cards);
    })
    .catch(next);
};

// Создать карточку
const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => {
      if (!card) {
        throw new BadRequest('Данные не прошли валидацию');
      }
      res.status(200).send(card);
    })
    .catch(next);
};

// Удалить карточку
const deleteCard = (req, res, next) => {
  Card.findOneAndRemove({ owner: req.user._id, _id: req.params.cardId })
    .then((card) => {
      if (!card) {
        throw new BadRequest('Не удалось удалить карточку');
      }
      res.status(200).send({ message: 'Карточка удалена' });
    })
    .catch(next);
};

// Поставить карточке лайк
const putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new BadRequest('Id карточки не валидный');
      }
      res.status(200).send(card);
    })
    .catch(next);
};

// Удалить у карточки лайк
const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new BadRequest('Id карточки не валидный');
      }
      res.status(200).send('Карточка удалена');
    })
    .catch(next);
};

module.exports = {
  getCards, createCard, deleteCard, putLike, deleteLike,
};
