require("dotenv").config()

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
    timezone: "+07:00",
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
    timezone: "+07:00",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
    timezone: "+07:00",
  },

  node_red: {
    username: "iot_prod",
    password: "123456",
    database: "node_red",
    host: "192.168.9.8",
    dialect: "mysql",
    port: 3306,
    timezone: "+07:00",
  },

  valcal: {
    username: "iot_prod",
    password: "123456",
    database: "valcal",
    host: "192.168.9.47",
    dialect: "mysql",
    port: 3306,
    timezone: "+07:00",
  },

  iot_fsb: {
    username: "iot_prod",
    password: "P@ssw0rd123",
    database: "aio_iot_fsb",
    host: "192.168.9.49",
    dialect: "mysql",
    port: 6446,
    timezone: "+07:00",
  },

  iot_oci1: {
    username: "iot_prod",
    password: "P@ssw0rd123",
    database: "aio_iot_oci1",
    host: "192.168.9.49",
    dialect: "mysql",
    port: 6446,
    timezone: "+07:00",
  },

  iot_oci2: {
    username: "iot_prod",
    password: "P@ssw0rd123",
    database: "aio_iot_oci2",
    host: "192.168.9.49",
    dialect: "mysql",
    port: 6446,
    timezone: "+07:00",
  },
  

  login_aio: {
    username: "iot_prod",
    password: "123456",
    database: "aio_employee",
    host: "192.168.9.47",
    dialect: "mysql",
    port: 3306,
    timezone: "+07:00",
  }
  

}