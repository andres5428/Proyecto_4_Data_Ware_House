/**
 * Json Web Token Init 
 */
const jwt = require('jsonwebtoken');

/**
 * Global Variable
 */
let admin_Status;

const contact = require('../database/models/contact');
const excel = require("exceljs");

/**
 * Init dotenv
 */
require('dotenv').config();

/**
 * Config secret Key variable
 */
const { config } = require('../database/config/config')

/**
 * Import models
 */
const user = require('../database/models/user');
const admin = require('../database/models/admin');

const download = (req, res, next) => {
  contact.findAll().then((objs) => {
    let contacts = [];

    objs.forEach((obj) => {
      contacts.push({
        id: obj.id,
        name: obj.name,
        lastname: obj.lastname,
        email: obj.email,
        position: obj.position,
        channel: obj.channel,
        account: obj.account,
        interest: obj.interest,
        preference: obj.preference,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
        companyId: obj.companyId,
        cityId: obj.cityId
      });
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("contacts");

    worksheet.columns = [
      { header: "Id", key: "id", width: 5 },
      { header: "Name", key: "name", width: 25 },
      { header: "Lastname", key: "lastname", width: 25 },
      { header: "Email", key: "email", width: 10 },
      { header: "Position", key: "position", width: 10 },
      { header: "Channel", key: "channel", width: 10 },
      { header: "Account", key: "account", width: 10 },
      { header: "Interest", key: "interest", width: 10 },
      { header: "Preference", key: "preference", width: 10 },
      { header: "CreatedAt", key: "createdAt", width: 10 },
      { header: "UpdatedAt", key: "updatedAt", width: 10 },
      { header: "CompanyId", key: "companyId", width: 10 },
      { header: "CityId", key: "cityId", width: 10 },
    ];

    // Add Array Rows
    worksheet.addRows(contacts);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "contacts.xlsx"
    );
    
    req.excelSheet = workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
    next();

    // return workbook.xlsx.write(res).then(function () {
    //   res.status(200).end();
    // });

  });
};


/**
 * @method construct_JWT
 * @description Generate a Jason Web Token from the body request information - User
 */

const construct_JWT = ((req, res, next) => {
  const token = jwt.sign(req.body, `${config.secret_Key}`, { expiresIn: '60m' });
  req.token = token;
  next();
});

/**
 * @method check_Admin_State
 * @description checks the admin status
 */
const check_Admin_State = ((req, res, next) => {
  req.admin = admin_Status;
  next();
})

/**
 * @method extract_JWT
 * @description Take the token that the user bring and separate it from the bearer method - User
 */

const extract_JWT = ((req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  console.log(bearerHeader)
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" "); // divides the strings into a ordered list of substrings and returns them into an array
    const bearerToken = bearer[1]; // Take the second position of the array (Token)
    req.token = bearerToken;
    console.log(admin_Status)
    next();
  }
  else {
    const error = new Error('No has ingresado un Token válido. Recuerda utilizar bearer');
    error.status = 401;
    error.title = `Error en validación`
    next(error);
  }
});

/**
 * @method jsonVerify
 * @description Verify the token sended from user
 */

const jsonVerify = ((req, res, next) => {
  jwt.verify(req.token, config.secret_Key, ((err, data) => {
    if (err) {
      const error = new Error('El token enviado no es válido');
      error.status = 401;
      error.title = `Error en validación`
      next(error);
    }
    else {
      delete data.password
      next();
    }
  }));
});

/**
 * @method jsonVerify_Admin
 * @description Verify the token sended from user
 */

const jsonVerify_Admin = ((req, res, next) => {
  jwt.verify(req.token, config.secret_Key, ((err, data) => {
    if (err) {
      const error = new Error('El token enviado no es válido');
      error.status = 401;
      error.title = `Error en validación`
      next(error);
    }
    else {
      if (admin_Status === true) {
        delete data.password
        next();
      }
      else {
        const error = new Error('No tienes permisos para realizar esta acción');
        error.status = 401;
        error.title = `No autorizado`
        next(error);
      }
    }
  }));
});

/**
 * @method check_User
 * @description checks in te database the username sended from the client
 */

const check_User = ((req, res, next) => {
  const email_Search = user.findOne({ where: { email: `${req.body.email}` } }).then((user) => {
    return user
  })
  email_Search.then((user) => {
    if (!user) {
      const error = new Error('El usuario no esta registrado en la base de datos. Por favor realice el proceso de registro');
      error.status = 403;
      error.title = `Error en validación`
      next(error);
    }

    next();
  })
});

/**
 * @method check_Admin
 * @description Checks in the database the admin sended from the client
 */

const check_Admin = ((req, res, next) => {
  const admin_Search = admin.findOne({ where: { email: `${req.body.email}` } }).then((admin) => {
    return admin
  });
  admin_Search.then((admin) => {
    if (!admin) {
      const error = new Error('El usuario no esta registrado en la base de datos. Por favor realice el proceso de registro');
      error.status = 403;
      error.title = `Error en validación`
      next(error);
    }

    next();
  })
});

/**
 * @method autenticate_User
 * @description Autenticate the credentials sended from the client
 */

const autenticate_User = ((req, res, next) => {
  const user_Index = user.findOne({ where: { email: `${req.body.email}` } }).then((user) => {
    return user
  })
  user_Index.then((user) => {
    if (user.dataValues.password !== req.body.password) {
      const error = new Error('La contraseña ingresada no es correcta. Por favor intente de nuevo');
      error.status = 401;
      error.title = `Error en validación`
      next(error);
    }
    // req.admin = false;
    admin_Status = false;
    next();
  })
});

/**
 * @method autenticate_Admin
 * @description Autenticate the credentials sended from the client
 */
const autenticate_Admin = ((req, res, next) => {
  const admin_Index = admin.findOne({ where: { email: `${req.body.email}` } }).then((admin) => {
    return admin
  })

  admin_Index.then((admin) => {
    if (admin.dataValues.password !== req.body.password) {
      const error = new Error('La contraseña ingresada no es correcta. Por favor intente de nuevo');
      error.status = 401;
      error.title = `Error en validación`
      next(error);
    }
    // req.admin = true;
    admin_Status = true;
    next();
  })
});

/**
 * @method validate_Email_User
 * @description checks if the e-mail that want to register is already in the database
 */

const validate_Email_User = ((req, res, next) => {
  const email_Search = user.findOne({ where: { email: `${req.body.email}` } }).then((user) => {
    return user
  });

  email_Search.then((user) => {
    if (!user) {
      next();
    }
    else {
      const error = new Error('El usuario ingresado ya está registrado en la base de datos. Por favor intente con uno diferente');
      error.status = 403;
      error.title = `Error en validación`
      next(error);
    }

  })
});

/**
 * @method validate_Email_Admin
 * @description checks if the e-mail that want to register is already in the database
 */

const validate_Email_Admin = ((req, res, next) => {
  const email_Search = admin.findOne({ where: { email: `${req.body.email}` } }).then((admin) => {
    return admin
  });

  email_Search.then((admin) => {
    if (!admin) {
      next();
    }
    else {
      const error = new Error('El administrador ya está registrado en la base de datos. Por favor intente con uno diferente');
      error.status = 403;
      error.title = `Error en validación`
      next(error);
    }

  })
});

module.exports = {
  autenticate_User: autenticate_User, autenticate_Admin: autenticate_Admin,
  construct_JWT: construct_JWT, check_User: check_User,
  check_Admin: check_Admin, validate_Email_User: validate_Email_User,
  validate_Email_Admin: validate_Email_Admin, extract_JWT: extract_JWT,
  jsonVerify: jsonVerify, jsonVerify_Admin: jsonVerify_Admin, check_Admin_State: check_Admin_State, download: download
}