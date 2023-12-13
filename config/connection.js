const Sequelize = require('sequelize')
const config = require('./config')

const devDB = new Sequelize(config.development.database, config.development.username, config.development.password, config.development);
const node_redDB = new Sequelize(config.node_red.database, config.node_red.username, config.node_red.password, config.node_red);
const valcalDB = new Sequelize(config.valcal.database, config.valcal.username, config.valcal.password, config.valcal);
const iot_fsb = new Sequelize(config.iot_fsb.database, config.iot_fsb.username, config.iot_fsb.password, config.iot_fsb);
const iot_oci1 = new Sequelize(config.iot_oci1.database, config.iot_oci1.username, config.iot_oci1.password, config.iot_oci1);
const iot_oci2 = new Sequelize(config.iot_oci2.database, config.iot_oci2.username, config.iot_oci2.password, config.iot_oci2);

const login_aio = new Sequelize(config.login_aio.database, config.login_aio.username, config.login_aio.password, config.login_aio);

module.exports = {
    devDB,
    node_redDB,
    valcalDB,
    iot_fsb,
    iot_oci1,
    iot_oci2,
    login_aio
}