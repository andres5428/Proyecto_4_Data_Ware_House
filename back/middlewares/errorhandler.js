const { ValidationError } = require('express-json-validator-middleware');

/**
 * @method errorHandler
 * @description Middleware that manages the errors
 */

const errorHandler = ((err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(400).json({
      status: 400,
      ok: false,
      title: 'Petición errónea',
      detail: 'No has ingresado los datos solicitados. Recuerda utilizar un correo electrónico válido'
    });
    next();
  } else {
    res.status(`${err.status}`).json({
      status: `${err.status}`,
      ok: false,
      title: `${err.title}`,
      detail: `${err.message}`
    });
    next();
  }
});

module.exports = { errorHandler: errorHandler };