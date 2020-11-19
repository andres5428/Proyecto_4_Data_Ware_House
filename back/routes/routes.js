/**
 * Init router
 */
const { Router } = require('express');
const router = Router();

/**
 * Init the validator middleware
 */
const { Validator } = require('express-json-validator-middleware');
const validator = new Validator({ allErrors: true });
const validate = validator.validate

/**
 * Models
 */
const admin = require('../database/models/admin');
const user = require('../database/models/user');
const country = require('../database/models/country');
const region = require('../database/models/region');
const city = require('../database/models/city');
const company = require('../database/models/company');
const contact = require('../database/models/contact');


/**
 * Middlwares
 */

const { autenticate_User, construct_JWT, check_User, check_Admin, autenticate_Admin, validate_Email_Admin, validate_Email_User, check_Admin_State, extract_JWT, jsonVerify, jsonVerify_Admin, download } = require('../middlewares/index');

/**
 * Schemas
 */
const schema_login = require('../schemas/schema_login');
const schema_register = require('../schemas/schema_register');
const { _attributes } = require('../database/db');

/**
 * Login User
 */
router.post('/wareHouse/user/post/login', validate({ body: schema_login }), check_User, autenticate_User, construct_JWT, (req, res) => {
  res.status(200).json({
    status: 200,
    ok: true,
    title: 'Petición aceptada',
    detail: 'Has ingresado correctamente',
    token: req.token,
    admin: req.admin
  });
});

/**
 * Login Admin
 */
router.post('/wareHouse/admin/post/login', validate({ body: schema_login }), check_Admin, autenticate_Admin, construct_JWT, (req, res) => {
  res.status(200).json({
    status: 200,
    ok: true,
    title: 'Petición aceptada',
    detail: 'Has ingresado correctamente',
    token: req.token,
    // admin: req.admin
  });
});

/**
 * Create admin
 */
router.post('/wareHouse/admin/post/createAdmin', validate({ body: schema_register }), validate_Email_Admin, extract_JWT, jsonVerify_Admin, (req, res) => {
  admin.create({
    name: req.body.name,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password, /* hash here : bcrypt*/

  }).then((admin) => {
    res.status(200).json({
      status: 200,
      ok: true,
      detail: `El administrador "${req.body.email}" ha sido creado`
    })
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      title: 'Error interno del servidor',
      detail: error,
      ok: false
    })
  })
});

/**
* Create user
*/
router.post('/wareHouse/admin/post/createUser', validate({ body: schema_register }), validate_Email_User, extract_JWT, jsonVerify_Admin, (req, res) => {
  user.create({
    name: req.body.name,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password, /* hash here : bcrypt*/

  }).then((user) => {
    res.status(200).json({
      status: 200,
      title: 'Petición aceptada',
      ok: true,
      detail: `El usuario "${req.body.email}" ha sido creado`
    })
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      title: 'Error interno del servidor',
      detail: error,
      ok: false
    })
  })
});

/**
* Get users
*/
router.get('/wareHouse/admin/get/getUsers', (req, res) => {
  user.findAll({}).then((users) => {
    if (users === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: 'No se encuentran usuarios registrados en la base de datos'
      })
    }
    else {
      res.status(200).json({
        status: 200,
        title: 'Petición aceptada',
        ok: true,
        data: users
      });
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      title: 'Error interno del servidor',
      detail: error,
      ok: false
    })
  });
});

/**
* Get one contact
*/

router.get('/wareHouse/get/getOneUser/:contactId', (req, res) => {
  contact.findOne({
    where: { id: req.params.contactId },
    include: { all: true, nested: true }
  }).then((contact) => {
    if (contact === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: 'No se encuentran contactos registrados con ese id'
      })
    }
    else {
      res.status(200).json({
        status: 200,
        title: 'Petición aceptada',
        ok: true,
        data: contact
      });
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      title: 'Error interno del servidor',
      detail: error,
      ok: false
    })
  });
});

/**
 * Check the session
 */
router.get('/wareHouse/get/adminState', check_Admin_State, extract_JWT, jsonVerify, (req, res) => {
  res.status(200).json({
    status: 200,
    title: 'Petición aceptada',
    ok: true,
    admin: req.admin
  });
});

/**
* Modify user
*/
router.put('/wareHouse/put/users/:userId', extract_JWT, jsonVerify, (req, res) => {
  user.findByPk(req.params.userId).then(userFound => {
    if (userFound === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: `El usuario con id "${req.params.userId}" no existe en la base de datos`
      })
    }
    else {
      userFound.name = req.body.name;
      userFound.lastname = req.body.lastname;
      userFound.email = req.body.email;
      userFound.save().then((userSaved) => {
        res.status(200).json({
          status: 200,
          ok: true,
          data: userSaved,
          title: 'Petición aceptada',
          detail: `El usuario "${req.body.name}" ha sido modificado correctamente`
        })
      }).catch((error) => {
        res.status(500).json({
          status: 500,
          title: 'Error interno del servidor',
          detail: error,
          ok: false
        })
      })
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      title: 'Error interno del servidor',
      detail: error,
      ok: false
    });
  });
});

/**
 * Delete user
 */

router.delete('/wareHouse/delete/users/:userId', extract_JWT, jsonVerify, (req, res) => {
  user.findByPk(req.params.userId).then(userFound => {
    if (userFound === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: `El usuario con id "${req.params.userId}" no existe en la base de datos`
      })
    }
    else {
      userFound.destroy().then(() => {
        res.status(200).json({
          status: 200,
          title: 'Petición aceptada',
          ok: true,
          detail: `El usuario "${userFound.name}" ha sido eliminado de la base de datos`
        })
      }).catch((error) => {
        res.status(500).json({
          status: 500,
          error: error,
          ok: false
        });
      })
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      error: error,
      ok: false
    });
  });
});

/**
* Get regions info
*/
router.get('/wareHouse/get/getRegions', (req, res) => {
  region.findAll({
    attributes: ['id', 'name'],
    include: {
      model: country,
      as: 'countries',
      attributes: ['id', 'name', 'regionId'],
      include: {
        model: city,
        as: 'cities',
        attributes: ['id', 'name', 'countryId'],
      }
    }
  }).then((regions) => {
    if (regions === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: 'No se encuentran usuarios registrados en la base de datos'
      })
    }
    else {
      res.status(200).json({
        status: 200,
        title: 'Petición aceptada',
        ok: true,
        data: regions
      });
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      title: 'Error interno del servidor',
      detail: error,
      ok: false
    })
  });
});

/**
* Get specific region
*/
router.get('/wareHouse/get/region/:regionId', (req, res) => {
  region.findOne({
    where: { id: req.params.regionId },
    attributes: ['id', 'name'],
    include: {
      model: country,
      as: 'countries',
      attributes: ['id', 'name', 'regionId'],
      include: {
        model: city,
        as: 'cities',
        attributes: ['id', 'name', 'countryId'],
      }
    }
  }).then((regions) => {
    if (regions === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: 'No se encuentran regiones registradas en la base de datos'
      })
    }
    else {
      res.status(200).json({
        status: 200,
        title: 'Petición aceptada',
        ok: true,
        data: regions
      });
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      title: 'Error interno del servidor',
      detail: error,
      ok: false
    })
  });
});

/**
 * Create region
 */
router.post('/wareHouse/post/createRegion', extract_JWT, jsonVerify, (req, res) => {
  region.create({
    name: req.body.name
  }).then((region) => {
    res.status(200).json({
      status: 200,
      title: 'Petición aceptada',
      ok: true,
      detail: `La región "${req.body.name}" ha sido creada`
    });
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      title: 'Error interno del servidor',
      detail: error,
      ok: false
    });
  });
});

/**
* Modify Region
*/
router.put('/wareHouse/put/region/:regionId', extract_JWT, jsonVerify, (req, res) => {
  region.findByPk(req.params.regionId).then(regionFound => {
    if (regionFound === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: `La región con id "${req.params.regionId}" no existe en la base de datos`
      })
    }
    else {
      regionFound.name = req.body.name;
      regionFound.save().then((regionSaved) => {
        res.status(200).json({
          status: 200,
          ok: true,
          data: regionSaved,
          title: 'Petición aceptada',
          detail: `La región "${req.body.name}" ha sido modificado correctamente`
        })
      }).catch((error) => {
        res.status(500).json({
          status: 500,
          title: 'Error interno del servidor',
          detail: error,
          ok: false
        })
      })
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      title: 'Error interno del servidor',
      detail: error,
      ok: false
    });
  });
});

/**
 * Delete region
 */

router.delete('/wareHouse/delete/region/:regionId', extract_JWT, jsonVerify, (req, res) => {
  region.findByPk(req.params.regionId).then(regionFound => {
    if (regionFound === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: `La región con id "${req.params.regionId}" no existe en la base de datos`
      })
    }
    else {
      regionFound.destroy().then(() => {
        res.status(200).json({
          status: 200,
          title: 'Petición aceptada',
          ok: true,
          detail: `La región "${regionFound.name}" ha sido eliminado de la base de datos`
        })
      }).catch((error) => {
        res.status(500).json({
          status: 500,
          error: error,
          ok: false
        });
      })
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      error: error,
      ok: false
    });
  });
});


/**
* Get specific country
*/
router.get('/wareHouse/get/country/:countryId', (req, res) => {
  country.findOne({
    where: { id: req.params.countryId },
    attributes: ['id', 'name'],
    include: {
      model: city,
      as: 'cities',
    }
  }).then((countries) => {
    if (countries === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: 'No se encuentran paises registrados en la base de datos'
      })
    }
    else {
      res.status(200).json({
        status: 200,
        title: 'Petición aceptada',
        ok: true,
        data: countries
      });
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      title: 'Error interno del servidor',
      detail: error,
      ok: false
    })
  });
});

/**
 * Create country
 */
router.post('/wareHouse/post/createCountry/:regionId', extract_JWT, jsonVerify, (req, res) => {
  country.create({
    name: req.body.name,
    regionId: req.params.regionId
  }).then((country) => {
    res.status(200).json({
      status: 200,
      title: 'Petición aceptada',
      ok: true,
      detail: `El país "${req.body.name}" ha sido creada`
    });
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      title: 'Error interno del servidor',
      detail: error,
      ok: false
    });
  });
});

/**
* Modify country
*/
router.put('/wareHouse/put/country/:countryId', extract_JWT, jsonVerify, (req, res) => {
  country.findByPk(req.params.countryId).then(countryFound => {
    if (countryFound === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: `El país con id "${req.params.countryId}" no existe en la base de datos`
      })
    }
    else {
      countryFound.name = req.body.name;
      countryFound.save().then((countrySaved) => {
        res.status(200).json({
          status: 200,
          ok: true,
          data: countrySaved,
          title: 'Petición aceptada',
          detail: `El país "${req.body.name}" ha sido modificado correctamente`
        })
      }).catch((error) => {
        res.status(500).json({
          status: 500,
          title: 'Error interno del servidor',
          detail: error,
          ok: false
        })
      })
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      title: 'Error interno del servidor',
      detail: error,
      ok: false
    });
  });
});

/**
 * Delete country
 */

router.delete('/wareHouse/delete/country/:countryId', extract_JWT, jsonVerify, (req, res) => {
  country.findByPk(req.params.countryId).then(countryFound => {
    if (countryFound === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: `El país con id "${req.params.countryId}" no existe en la base de datos`
      })
    }
    else {
      countryFound.destroy().then(() => {
        res.status(200).json({
          status: 200,
          title: 'Petición aceptada',
          ok: true,
          detail: `El país "${countryFound.name}" ha sido eliminado de la base de datos`
        })
      }).catch((error) => {
        res.status(500).json({
          status: 500,
          error: error,
          ok: false
        });
      })
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      error: error,
      ok: false
    });
  });
});

/**
 * Create city
 */
router.post('/wareHouse/post/createCity/:countryId', extract_JWT, jsonVerify, (req, res) => {
  city.create({
    name: req.body.name,
    countryId: req.params.countryId
  }).then((city) => {
    res.status(200).json({
      status: 200,
      title: 'Petición aceptada',
      ok: true,
      detail: `La ciudad "${req.body.name}" ha sido creada`
    });
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      title: 'Error interno del servidor',
      detail: error,
      ok: false
    });
  });
});

/**
* Modify city
*/
router.put('/wareHouse/put/city/:cityId', extract_JWT, jsonVerify, (req, res) => {
  city.findByPk(req.params.cityId).then(cityFound => {
    if (cityFound === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: `La ciudad con id "${req.params.cityId}" no existe en la base de datos`
      })
    }
    else {
      cityFound.name = req.body.name;
      cityFound.save().then((citySaved) => {
        res.status(200).json({
          status: 200,
          ok: true,
          data: citySaved,
          title: 'Petición aceptada',
          detail: `La ciudad "${req.body.name}" ha sido modificada correctamente`
        })
      }).catch((error) => {
        res.status(500).json({
          status: 500,
          title: 'Error interno del servidor',
          detail: error,
          ok: false
        })
      })
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      title: 'Error interno del servidor',
      detail: error,
      ok: false
    });
  });
});

/**
 * Delete city
 */

router.delete('/wareHouse/delete/city/:cityId', extract_JWT, jsonVerify, (req, res) => {
  city.findByPk(req.params.cityId).then(cityFound => {
    if (cityFound === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: `La ciudad con id "${req.params.cityId}" no existe en la base de datos`
      })
    }
    else {
      cityFound.destroy().then(() => {
        res.status(200).json({
          status: 200,
          title: 'Petición aceptada',
          ok: true,
          detail: `La ciudad "${cityFound.name}" ha sido eliminada de la base de datos`
        })
      }).catch((error) => {
        res.status(500).json({
          status: 500,
          error: error,
          ok: false
        });
      })
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      error: error,
      ok: false
    });
  });
});

/**
 * Get Companies
 */
router.get('/wareHouse/get/getCompanies', (req, res) => {
  company.findAll({
    attributes: ['id', 'name', 'address', 'email', 'telephone'],
    include: {
      model: city,
      attributes: ['id', 'name'],
      include: {
        model: country,
        attributes: ['id', 'name'],
        include: {
          model: region,
          attributes: ['id', 'name']
        }
      }
    }
  }).then((companies) => {
    if (companies === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: 'No se encuentran compañias registradas en la base de datos'
      })
    }
    else {
      res.status(200).json({
        status: 200,
        title: 'Petición aceptada',
        ok: true,
        data: companies
      });
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      title: 'Error interno del servidor',
      detail: error,
      ok: false
    })
  });
});

/**
 * Create company
 */
router.post('/wareHouse/post/createCompany/:cityId', extract_JWT, jsonVerify, (req, res) => {
  company.create({
    name: req.body.name,
    cityId: req.params.cityId,
    address: req.body.address,
    email: req.body.email,
    telephone: req.body.telephone
  }).then((company) => {
    res.status(200).json({
      status: 200,
      title: 'Petición aceptada',
      ok: true,
      detail: `La compañia "${req.body.name}" ha sido creada`
    });
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      title: 'Error interno del servidor',
      detail: error,
      ok: false
    });
  });
});

/**
* Modify company
*/
router.put('/wareHouse/put/company/:companyId/:cityId', extract_JWT, jsonVerify, (req, res) => {
  company.findByPk(req.params.companyId).then(companyFound => {
    if (companyFound === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: `La compañia con id "${req.params.companyId}" no existe en la base de datos`
      })
    }
    else {
      companyFound.name = req.body.name;
      companyFound.companyId = req.params.companyId;
      companyFound.address = req.body.address;
      companyFound.email = req.body.email;
      companyFound.telephone = req.body.telephone;
      companyFound.cityId = req.params.cityId;
      companyFound.save().then((companySaved) => {
        res.status(200).json({
          status: 200,
          ok: true,
          data: companySaved,
          title: 'Petición aceptada',
          detail: `La compañia "${req.body.name}" ha sido modificada correctamente`
        })
      }).catch((error) => {
        res.status(500).json({
          status: 500,
          title: 'Error interno del servidor',
          detail: error,
          ok: false
        })
      })
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      title: 'Error interno del servidor',
      detail: error,
      ok: false
    });
  });
});

/**
 * Delete company
 */

router.delete('/wareHouse/delete/company/:companyId', extract_JWT, jsonVerify, (req, res) => {
  company.findByPk(req.params.companyId).then(companyFound => {
    if (companyFound === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: `La compañia con id "${req.params.companyId}" no existe en la base de datos`
      })
    }
    else {
      companyFound.destroy().then(() => {
        res.status(200).json({
          status: 200,
          title: 'Petición aceptada',
          ok: true,
          detail: `La compañia "${companyFound.name}" ha sido eliminada de la base de datos`
        })
      }).catch((error) => {
        res.status(500).json({
          status: 500,
          error: error,
          ok: false
        });
      })
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      error: error,
      ok: false
    });
  });
});

/**
 * Get cities for create company
 */

router.get('/wareHouse/get/getCities', (req, res) => {
  city.findAll({
    attributes: ['id', 'name'],
    include: {
      model: country,
      attributes: ['id', 'name'],
      include: {
        model: region,
        attributes: ['id', 'name']
      }
    }
  }).then((cities) => {
    if (cities === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: 'No se encuentran compañias registradas en la base de datos'
      });
    }
    else {
      res.status(200).json({
        status: 200,
        title: 'Petición aceptada',
        ok: true,
        data: cities
      });
    }
  }).catch((error) => {
    console.log(error);
    res.status(500).json({
      status: 500,
      title: 'Error interno del servidor',
      detail: error,
      ok: false
    })
  });;
});

/**
 * Get contacts
 */
router.get('/wareHouse/get/getContacts', (req, res) => {
  contact.findAll({
    include: [{
      model: city,
      attributes: ['id', 'name'],
      include: {
        model: country,
        attributes: ['id', 'name'],
        include: {
          model: region,
          attributes: ['id', 'name']
        }
      }
    },
    {
      model: company,
      attributes: ['id', 'name']
    }]

  }).then((contacts) => {
    if (contacts === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: 'No se encuentran contactos registrados en la base de datos'
      })
    }
    else {
      res.status(200).json({
        status: 200,
        title: 'Petición aceptada',
        ok: true,
        data: contacts
      });
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      title: 'Error interno del servidor',
      detail: error,
      ok: false
    })
  });
});

/**
 * Get ordered contacts ASC
 */
router.post('/wareHouse/get/ASC_Contacts', (req, res) => {
  contact.findAll({
    order: [[req.body.column, 'ASC']],
    include: [{
      model: city,
      attributes: ['id', 'name'],
      include: {
        model: country,
        attributes: ['id', 'name'],
        include: {
          model: region,
          attributes: ['id', 'name']
        }
      }
    },
    {
      model: company,
      attributes: ['id', 'name']
    }]

  }).then((contacts) => {
    if (contacts === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: 'No se encuentran contactos registrados en la base de datos'
      })
    }
    else {
      res.status(200).json({
        status: 200,
        title: 'Petición aceptada',
        ok: true,
        data: contacts
      });
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      title: 'Error interno del servidor',
      detail: error,
      ok: false
    })
  });
});

/**
 * Get ordered contacts DESC
 */
router.post('/wareHouse/get/DESC_Contacts', (req, res) => {
  contact.findAll({
    order: [[req.body.column, 'DESC']],
    include: [{
      model: city,
      attributes: ['id', 'name'],
      include: {
        model: country,
        attributes: ['id', 'name'],
        include: {
          model: region,
          attributes: ['id', 'name']
        }
      }
    },
    {
      model: company,
      attributes: ['id', 'name']
    }]

  }).then((contacts) => {
    if (contacts === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: 'No se encuentran contactos registrados en la base de datos'
      })
    }
    else {
      res.status(200).json({
        status: 200,
        title: 'Petición aceptada',
        ok: true,
        data: contacts
      });
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      title: 'Error interno del servidor',
      detail: error,
      ok: false
    })
  });
});

/**
 * Create contact
 */
router.post('/wareHouse/post/createContact/:cityId/:companyId', extract_JWT, jsonVerify, (req, res) => {
  contact.create({
    name: req.body.name,
    lastname: req.body.lastname,
    email: req.body.email,
    position: req.body.position,
    channel: req.body.channel,
    interest: req.body.interest,
    account: req.body.account,
    preference: req.body.preference,
    cityId: req.params.cityId,
    companyId: req.params.companyId,
    address: req.body.address,
    image: req.body.image
  }).then((contact) => {
    res.status(200).json({
      status: 200,
      title: 'Petición aceptada',
      ok: true,
      detail: `El contacto "${req.body.name}" ha sido creado`
    });
  }).catch((error) => {
    console.log(error)
    res.status(500).json({
      status: 500,
      title: 'Error interno del servidor',
      detail: error,
      ok: false
    });
  });
});

/**
 * Modify Contact
 */
router.put('/wareHouse/put/contact/:cityId/:companyId/:contactId', extract_JWT, jsonVerify, (req, res) => {
  contact.findByPk(req.params.contactId).then(contactFound => {
    if (contactFound === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: `El contacto con id "${req.params.contactId}" no existe en la base de datos`
      })
    }
    else {
      contactFound.name = req.body.name;
      contactFound.lastname = req.body.lastname;
      contactFound.email = req.body.email;
      contactFound.position = req.body.position;
      contactFound.channel = req.body.channel;
      contactFound.interest = req.body.interest;
      contactFound.account = req.body.account;
      contactFound.preference = req.body.preference;
      contactFound.cityId = req.params.cityId;
      contactFound.companyId = req.params.companyId;
      contactFound.save().then((contactSaved) => {
        res.status(200).json({
          status: 200,
          ok: true,
          data: contactSaved,
          title: 'Petición aceptada',
          detail: `El contacto "${req.body.name}" ha sido modificado correctamente`
        })
      }).catch((error) => {
        res.status(500).json({
          status: 500,
          title: 'Error interno del servidor',
          detail: error,
          ok: false
        })
      })
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      title: 'Error interno del servidor',
      detail: error,
      ok: false
    });
  });
});

/**
 * Delete contact
 */

router.delete('/wareHouse/delete/contact/:contactId', extract_JWT, jsonVerify, (req, res) => {
  contact.findByPk(req.params.contactId).then(contactFound => {
    if (contactFound === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: `El contacto con id "${req.params.contactId}" no existe en la base de datos`
      })
    }
    else {
      contactFound.destroy().then(() => {
        res.status(200).json({
          status: 200,
          title: 'Petición aceptada',
          ok: true,
          detail: `El contacto "${contactFound.name}" ha sido eliminado de la base de datos`
        })
      }).catch((error) => {
        res.status(500).json({
          status: 500,
          error: error,
          ok: false
        });
      })
    }
  }).catch((error) => {
    res.status(500).json({
      status: 500,
      error: error,
      ok: false
    });
  });
});

/**
 * Get filtered contacts
 */
const { Op } = require("sequelize");
const excel_controller = require('../database/controllers/contacts/excel_controller');
router.post('/wareHouse/post/postFilteredContacts', (req, res) => {
  contact.findAll({
    include: {
      all: true,
      nested: true,
      model: city
    },
    where: {
      [Op.or]: [
        {
          name: {
            [Op.like]: `%${req.body.search}%`
          }

        },
        {
          lastname: {
            [Op.like]: `%${req.body.search}%`
          }
        },
        {
          email: {
            [Op.like]: `%${req.body.search}%`
          }
        },
        {
          position: {
            [Op.like]: `%${req.body.search}%`
          }
        },
        {
          channel: {
            [Op.like]: `%${req.body.search}%`
          }
        },
        {
          account: {
            [Op.like]: `%${req.body.search}%`
          }
        },
        {
          interest: {
            [Op.like]: `${req.body.search}%`
          }
        },
        {
          preference: {
            [Op.like]: `%${req.body.search}%`
          }
        },
      ]
    }

  }).then((contacts) => {
    if (contacts === null) {
      res.status(404).json({
        status: 404,
        ok: false,
        title: 'Contenido no encontrado',
        detail: 'No se encuentran contactos registrados en la base de datos'
      })
    }
    else {
      res.status(200).json({
        status: 200,
        title: 'Petición aceptada',
        ok: true,
        data: contacts
      });
    }
  }).catch((error) => {
    console.log(error)
    res.status(500).json({
      status: 500,
      title: 'Error interno del servidor',
      detail: error,
      ok: false
    })
  });
});

module.exports = router;