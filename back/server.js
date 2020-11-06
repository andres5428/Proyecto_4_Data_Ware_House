/**
 * Init dotenv
 */
require('dotenv').config();

/**
 * Config port variable
 */
const { config } = require('./database/config/config')

// Sequelize Init
const sequelize = require('../back/database/db');

/**
 * Server configuration
 */

const express = require('express');
const server = express();
const port = config.port;

/**
 * Errorhandler
 */
const { errorHandler } = require('./middlewares/errorhandler');

/**
 * Helmet init - Security
 */
const helmet = require("helmet");

/**
 * Relations
 */
require('./database/associations');


/**
 * Server init
 */
server.listen(port, () => {
  console.log(`El servidor funciona correctamente a través del puerto ${port}`);
  sequelize.sync({ force: false }).then(() => {
    console.log("Conexión establecida con la base de datos")
  }).catch((error) => {
    console.log("Se ha producido un error", error);
  })
});

/**
 * Routing
 */
const routes = require('../back/routes/routes');

/**
 * Cors init
 */
var cors = require('cors');
const initRoutes = require("./routes/routes_Export");


/**
 * Global middlewares
 */

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(helmet());
server.use(cors());
initRoutes(server);
server.use(routes);
server.use(errorHandler);
