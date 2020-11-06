const express = require("express");
const router = express.Router();
const excelController = require("../database/controllers/contacts/excel_controller");

let routes_Export = (server) => {
  router.get("/wareHouse/excel/get/contacts", excelController.download);
  server.use("/api/excel", router);
};

module.exports = routes_Export;