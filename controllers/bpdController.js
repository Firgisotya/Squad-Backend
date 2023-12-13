const { node_redDB } = require("../config/connection");

module.exports = {
  getBPDOC1Hour: async (req, res) => {
    try {
      let query;
      query = await node_redDB.query(`
            SELECT 
            DATE_FORMAT(time, '%H:%i') AS hours,
            DATE_FORMAT(time, '%Y-%m-%d %H:%i') AS datehours,
            lotno1,
            epochtime,
            prod_order1,
            value,
            avg,min,max
            FROM bpdoc1
            where time between (DATE_ADD(NOW(), INTERVAL -10 DAY)) AND NOW() and DATE_FORMAT(time, '%Y-%m-%d %H:%i') <= NOW() and 
            prod_order1 != 0
            GROUP BY DATE_FORMAT(time, '%Y-%m-%d %H') 
            order by datehours desc
            limit 20
            `);

      res.status(200).json({
        message: "Get All Data BPD OC1 Success",
        data: query[0],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Get All Data BPD OC1 Failed",
      });
    }
  },

  getBPDOC2Hour: async (req, res) => {
    try {
      let query;
      query = await node_redDB.query(`
        SELECT 
        DATE_FORMAT(time, '%H:%i') AS hours,
        DATE_FORMAT(time, '%Y-%m-%d %H:%i') AS datehours,
        lotno2,
        epochtime,
        prod_order2,
        value,
        avg,min,max
        FROM bpd_oc2
        where time between (DATE_ADD(NOW(), INTERVAL -10 DAY)) AND NOW() and DATE_FORMAT(time, '%Y-%m-%d %H:%i') <= NOW() and 
        prod_order2 != 0
        GROUP BY DATE_FORMAT(time, '%Y-%m-%d %H') 
        order by datehours desc
        limit 20
              `);

      res.status(200).json({
        message: "Get All Data BPD OC2 Success",
        data: query[0],
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Get All Data BPD OC2 Failed",
      });
    }
  },

  getBoundaryOC1: async (req, res) => {
    try {
      let query;
      query = await node_redDB.query(
        `select 
      bpd_Lower_pressure_Min as lower,
      bpd_Upper_pressure_Max as upper
      from label_oci1 
      order by epochtime desc limit 1`
      );
      res.status(200).json({
        message: "Get All Data Boundary OC1",
        data: query[0],
      });
    } catch (error) {
      console.log(error);
    }
  },

  getBoundaryOC2: async (req, res) => {
    try {
      let query;
      query = await node_redDB.query(
        `select 
      bpd_Lower_pressure_Min as lower,
      bpd_Upper_pressure_Max as upper
      from label_oci2 
      order by epochtime desc limit 1`
      );
      res.status(200).json({
        message: "Get All Data Boundary OC2",
        data: query[0],
      });
    } catch (error) {
      console.log(error);
    }
  },

};
