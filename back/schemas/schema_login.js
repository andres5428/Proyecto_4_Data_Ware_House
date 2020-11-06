module.exports = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', pattern: `^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$` },
    password: { type: 'string' }
  }
};