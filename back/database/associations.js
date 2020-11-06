const country = require('./models/country');
const region = require('./models/region');
const city = require('./models/city');
const company = require('./models/company');
const contact = require('./models/contact');

region.hasMany(country, { as: 'countries', foreignKey: "regionId" });
country.belongsTo(region);
country.hasMany(city, { as: 'cities', foreignKey: "countryId" });
city.belongsTo(country);
company.belongsTo(city);
contact.belongsTo(company);
contact.belongsTo(city);

