const { sequelize } = require("../models");
const { iot_fsb } = require("../config/connection");

module.exports = {
  getRejection: async (req, res) => {
    try {
      let query;
      const { reason, varian, startDate, endDate } = req.body;
      console.log(startDate && endDate);
      if (reason && startDate && endDate) {
        console.log(startDate, endDate);
        query = await iot_fsb.query(`
        select
        a.lotno,
        concat(a.lotno, " ", c.code_prod) as 'new_lotno',
        date_format(a.tgl, "%Y-%m-%d") as tanggal, 
        b.prod_order,
        c.keterangan,
        c.code_prod,
        a.pro_inspeksi,
        d.produk,
        e.rejection as 'total_reject',
        e.total_finishgood,
        e.feeding as 'qty_inspeksi',
        h.reason_desc,
        (e.rejection / e.feeding ) * 100 as 'defect'
        from tr_inspeksi_h a
        join mst_prodidentity b on a.lotno = b.lotno 
        join mst_product c on b.product = c.code_prod 
        join v_pro_inspeksi d on a.pro_inspeksi = d.pro 
        join tr_inspection_capa_h e on a.lotno = e.lotno 
        join 6_catatan_hasil_produk_jadi f on b.prod_order = f.pro 
        join tr_inspeksi_d g on a.id = g.id_head
        join mst_reasoncode h on g.reason_code = h.reason_code 
        where h.reason_desc = '${reason}'
        and d.produk = '${varian}'
        and b.tgl >= '${startDate}' AND b.tgl <= '${endDate}'
        group by a.lotno
        order by a.lotno desc
        `);
      } else {
        query = await iot_fsb.query(`
        select
    a.lotno,
    concat(a.lotno, " ", c.code_prod) as 'new_lotno',
    date_format(a.tgl, "%Y-%m-%d") as tanggal, 
    b.prod_order,
    c.keterangan,
    c.code_prod,
    a.pro_inspeksi,
    d.produk,
    e.rejection as 'total_reject',
    e.total_finishgood,
    e.feeding as 'qty_inspeksi',
    h.reason_desc,
    (e.rejection / e.feeding ) * 100 as 'defect'
    from tr_inspeksi_h a
    join mst_prodidentity b on a.lotno = b.lotno 
    join mst_product c on b.product = c.code_prod 
    join v_pro_inspeksi d on a.pro_inspeksi = d.pro 
    join tr_inspection_capa_h e on a.lotno = e.lotno 
    join 6_catatan_hasil_produk_jadi f on b.prod_order = f.pro 
    join tr_inspeksi_d g on a.id = g.id_head
    join mst_reasoncode h on g.reason_code = h.reason_code 
    where b.tgl >= CURDATE() - INTERVAL 30 day
    group by a.lotno
    order by a.lotno desc
        `);
      }

      res.status(200).send({
        message: "Get data success",
        data: query[0],
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Get data failed",
      });
    }
  },

  getAllReason: async (req, res) => {
    
    try {
      let query;
      query = await iot_fsb.query(`
      select * from mst_reasoncode
      `);

      res.status(200).send({
        message: "Get data success",
        data: query[0],
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Get data failed",
      });
    }
  },

  getAllProduct: async (req, res) => {
    try {
      let query;
      query = await iot_fsb.query(`
      select * from mst_product
      `);

      res.status(200).send({
        message: "Get data success",
        data: query[0],
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Get data failed",
      });
    }
  }
  
};
