const { DataTypes } = require('sequelize');
const { iot_oci1 } = require("../../config/connection");

const VFlow = iot_oci1.define('v_flowoci1', {
    tgl: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    lotno: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    prod_order: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    product: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    prod_start: {
        type: DataTypes.DECIMAL,
        allowNull: true,
    },
    fg_quarantine: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    sim_mikro: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    sim_ipc: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    inspeksi: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    capa: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    dynamic_form: {
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    ccp: {
        type: DataTypes.DECIMAL,
        allowNull: true,
    },
    
}, {
    tableName: 'v_flowoci1',
});

(async () => {
    await VFlow.sync();
    console.log('Model [v_flowoci1] is synced.');
})();

// async 
module.exports = { iot_oci1, VFlow };


