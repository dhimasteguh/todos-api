const { dbSettings, serverSettings } = require("./config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  dbSettings.db,
  dbSettings.user,
  dbSettings.pass,
  {
    host: dbSettings.host,
    dialect: "mysql",
    logging: false,
  }
);
module.exports = Object.assign({}, { sequelize });
