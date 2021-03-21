/* eslint-disable linebreak-style */
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const login = require('./routes/login');
const auth = require('./middlewares/auth');
const createUser = require('./routes/createUser');

const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
// eslint-disable-next-line no-console
}).then(() => console.log('Connected to DS'));

app.use(bodyParser.json()); // для собирания JSON-формата

app.post('/signin', login);
app.post('/signup', createUser);

// app.use(auth);

app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use('/*', (req, res) => res.status(404).send({ message: 'Запрашиваемый ресурс не найден' }));

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => (
  // eslint-disable-next-line no-console
  console.log(PORT)
));
