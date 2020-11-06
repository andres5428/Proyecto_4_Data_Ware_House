// Sequelize Init
// const sequelize = require('../back/database/db');
const contact = require('../../models/contact');
const excel = require("exceljs");

const download = (req, res) => {
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

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    });
};

module.exports = {
    download,
};