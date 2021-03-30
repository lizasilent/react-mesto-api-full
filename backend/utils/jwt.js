/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const generateSign = (payload) => jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

const isAuthorized = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return false;
  }
};

module.exports = { generateSign, isAuthorized };
