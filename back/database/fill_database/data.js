const sequelize = require('../db');
const contact = require('../models/contact');
const region = require('../models/region');
const country = require('../models/country');
const city = require('../models/city');
const company = require('../models/company');
const admin = require('../models/admin');
const user = require('../models/user');
require('../associations');

const contacts = [
    {
        name: "Alicia",
        lastname: "Echeverri",
        email: "Alicia_eche@gmail.com",
        position: "Ejecutiva comercial",
        channel: "Whatsapp",
        account: "Ali_Eche",
        interest: 50,
        preference: 'Sin preferencia',
        image: '../resources/yamaha-logo2.png',
        companyId: 1,
        cityId: 1
    },
    {
        name: "Camilo",
        lastname: "Jaramillo",
        email: "camilo_jara@gmail.com",
        position: "Desarrollador FE",
        channel: "Whatsapp",
        account: "milo_54",
        interest: 100,
        preference: 'Sin preferencia',
        image: '../resources/yamaha-logo2.png',
        companyId: 1,
        cityId: 2
    },
    {
        name: "Felipe",
        lastname: "Moncada",
        email: "Felipe_Mon@gmail.com",
        position: "TL",
        channel: "Teléfono",
        account: "Felipe_12",
        interest: 100,
        preference: 'Canal favorito',
        image: null,
        companyId: 1,
        cityId: 8
    },
    {
        name: "Andrés",
        lastname: "Álvarez",
        email: "andres_alv@gmail.com",
        position: "Desarrollador BE",
        channel: "Teléfono",
        account: "andres_12",
        interest: 75,
        preference: 'Canal favorito',
        image: '../resources/yamaha-logo2.png',
        companyId: 1,
        cityId: 6
    },
    {
        name: "Laura",
        lastname: "Álvarez",
        email: "Laura_alv@gmail.com",
        position: "Desarrollador BE",
        channel: "Teléfono",
        account: "Laura_12",
        interest: 25,
        preference: 'Canal favorito',
        image: null,
        companyId: 4,
        cityId: 7
    },
    {
        name: "Cristian",
        lastname: "Duque",
        email: "cristian_duq@gmail.com",
        position: "Software D",
        channel: "Teléfono",
        account: "Cristian_12",
        interest: 100,
        preference: 'Canal favorito',
        image: null,
        companyId: 10,
        cityId: 10
    },
    {
        name: "Monica",
        lastname: "Aristizabal",
        email: "Mon_Aris@gmail.com",
        position: "Coach",
        channel: "Whatsapp",
        account: "Mon_12",
        interest: 100,
        preference: 'Sin preferencia',
        image: '../resources/yamaha-logo2.png',
        companyId: 12,
        cityId: 12
    },
    {
        name: "Mocca",
        lastname: "Jaramillo",
        email: "Mocca_Jar@gmail.com",
        position: "Coach",
        channel: "Whatsapp",
        account: "Mocca_78",
        interest: 100,
        preference: 'Sin preferencia',
        image: '../resources/yamaha-logo2.png',
        companyId: 7,
        cityId: 7
    },
    {
        name: "Jorge",
        lastname: "Estrada",
        email: "jor_estr@gmail.com",
        position: "Engineer",
        channel: "Teléfono",
        account: "Jor_12",
        interest: 50,
        preference: 'Sin preferencia',
        image: '../resources/yamaha-logo2.png',
        companyId: 3,
        cityId: 3
    },
    {
        name: "Stiven",
        lastname: "Steiger",
        email: "st_st@gmail.com",
        position: "TL",
        channel: "Whatsapp",
        account: "st_22",
        interest: 100,
        preference: 'Sin preferencia',
        image: null,
        companyId: 9,
        cityId: 9
    },
    {
        name: "Lucía",
        lastname: "Rendón",
        email: "lu_cia@gmail.com",
        position: "Coach",
        channel: "Whatsapp",
        account: "lu_100",
        interest: 100,
        preference: 'Sin preferencia',
        image: '../resources/yamaha-logo2.png',
        companyId: 12,
        cityId: 12
    },
];

const regions = [
    {
        name: "America",
    },
    {
        name: "Europa",
    },
    {
        name: "Asia",
    },
    {
        name: "África",
    },
]

const countries = [
    {
        name: "Colombia",
        regionId: 1,
    },
    {
        name: "Argentina",
        regionId: 1,
    },
    {
        name: "Alemania",
        regionId: 2,
    },
    {
        name: "Francia",
        regionId: 2,
    },
    {
        name: "China",
        regionId: 3,
    },
    {
        name: "Japón",
        regionId: 3,
    },
    {
        name: "Costa de Marfil",
        regionId: 4,
    },
    {
        name: "Egipto",
        regionId: 4,
    },
]

const cities = [
    {
        name: "Medellín",
        countryId: 1,
    },
    {
        name: "Bogotá",
        countryId: 1,
    },
    {
        name: "Buenos Aires",
        countryId: 2,
    },
    {
        name: "Rosario",
        countryId: 2,
    },
    {
        name: "Berlín",
        countryId: 3,
    },
    {
        name: "Munich",
        countryId: 3,
    },
    {
        name: "París",
        countryId: 4,
    },
    {
        name: "Montpellier",
        countryId: 4,
    },
    {
        name: "Beijing",
        countryId: 5,
    },
    {
        name: "Hong Kong",
        countryId: 5,
    },
    {
        name: "Tokio",
        countryId: 6,
    },
    {
        name: "Kyoto",
        countryId: 6,
    },
    {
        name: "Abidjan",
        countryId: 7,
    },
    {
        name: "Bouake",
        countryId: 7,
    },
    {
        name: "Cairo",
        countryId: 8,
    },
    {
        name: "Alexandria",
        countryId: 8,
    },
]

const companies = [
    {
        name: "Medellin INC",
        address: "Calle 10",
        email: "medellin_inc@gmail.com",
        telephone: "3001232412",
        cityId: 1,
    },
    {
        name: "Bogotá INC",
        address: "Calle 20",
        email: "bogota_inc@gmail.com",
        telephone: "3101232412",
        cityId: 2,
    },
    {
        name: "Buenos Aires INC",
        address: "Calle 30",
        email: "buenosAires_inc@gmail.com",
        telephone: "3201232412",
        cityId: 3,
    },
    {
        name: "Rosario INC",
        address: "Calle 40",
        email: "Rosario_inc@gmail.com",
        telephone: "3301232412",
        cityId: 4,
    },
    {
        name: "Berlin INC",
        address: "Calle 50",
        email: "berlin_inc@gmail.com",
        telephone: "3501232412",
        cityId: 5,
    },
    {
        name: "Munich INC",
        address: "Calle 22",
        email: "munich_inc@gmail.com",
        telephone: "3401232412",
        cityId: 6,
    },
    {
        name: "París INC",
        address: "Calle 10",
        email: "paris_inc@gmail.com",
        telephone: "3001232412",
        cityId: 7,
    },
    {
        name: "Montpellier INC",
        address: "Calle 10",
        email: "montpellier_inc@gmail.com",
        telephone: "3001232412",
        cityId: 8,
    },
    {
        name: "Beijing INC",
        address: "Calle 80",
        email: "beijing_inc@gmail.com",
        telephone: "3321232412",
        cityId: 9,
    },
    {
        name: "Hong Kong INC",
        address: "Calle 10",
        email: "hongkong_inc@gmail.com",
        telephone: "3001232412",
        cityId: 10,
    },
    {
        name: "Tokio INC",
        address: "Calle 164",
        email: "tokio_inc@gmail.com",
        telephone: "3301232412",
        cityId: 11,
    },
    {
        name: "Kyoto INC",
        address: "Calle 10",
        email: "kyoto_inc@gmail.com",
        telephone: "371232412",
        cityId: 12,
    },
    {
        name: "Abidjan INC",
        address: "Calle 180",
        email: "abidjan_inc@gmail.com",
        telephone: "3901232412",
        cityId: 13,
    },
    {
        name: "Bouake INC",
        address: "Calle 8",
        email: "bouake_inc@gmail.com",
        telephone: "3901232412",
        cityId: 14,
    },
    {
        name: "Cairo INC",
        address: "Calle 72",
        email: "medellin_inc@gmail.com",
        telephone: "3201232412",
        cityId: 15,
    },
    {
        name: "Alexandria INC",
        address: "Calle 64",
        email: "alexandria_inc@gmail.com",
        telephone: "3071232412",
        cityId: 16,
    },
]


const users = [
    {
        name: "user1",
        lastname: "newUser",
        email: "user1@acamica.com",
        password: "user123",
    },
    {
        name: "user2",
        lastname: "newUser",
        email: "user2@acamica.com",
        password: "user123",
    }
]

const admins = [
    {
        name: "admin1",
        lastname: "newAdmin",
        email: "admin1@acamica.com",
        password: "admin123",
    },
    {
        name: "admin2",
        lastname: "newAdmin",
        email: "admin2@acamica.com",
        password: "admin123",
    }
]

sequelize.sync({ force: true}).then(() => {
    console.log("Conexión establecida con la base de datos")
}).then(() => {
    regions.forEach(regions => region.create(regions))
}).then(() => {
    countries.forEach(countries => country.create(countries))
}).then(() => {
    cities.forEach(cities => city.create(cities))
}).then(() => {
    companies.forEach(companies => company.create(companies))
}).then(() => {
    contacts.forEach(contacts => contact.create(contacts))
}).then(() => {
    users.forEach(users => user.create(users))
}).then(() => {
    admins.forEach(admins => admin.create(admins))
});