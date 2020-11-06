module.exports = {
  type: 'object',
  required: ['name', 'lastname', 'email', 'password'],
  properties: {
    name: { type: 'string' },
    lastname: { type: 'string' },
    email: { type: 'string', pattern: "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$" },
    password: { type: 'string' }
  }
};