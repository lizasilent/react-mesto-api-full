/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');

const NODE_ENV = 'production';
const JWT_SECRET = 'dev-secret';

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
