const { sequelize } = require("../models");
const { iot_fsb } = require("../config/connection");
const { iot_oci1 } = require("../config/connection");
const { iot_oci2 } = require("../config/connection");

module.exports = {
  getRejectionFSB: async (req, res) => {
    try {
      let query;
      const { reason, varian, startDate, endDate } = req.body;
      console.log(startDate && endDate);
      if (reason && varian && startDate && endDate) {
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
        e.fg_after_inspect,
        e.level_inspeksi,
        e.qty_release,
        h.reason_desc,
        (e.rejection / e.jml_prod ) * 100 as 'defect'
        from tr_inspeksi_h a
        left join mst_prodidentity b on a.lotno = b.lotno 
        left join mst_product c on b.product = c.code_prod 
        left join v_pro_inspeksi d on a.pro_inspeksi = d.pro 
        left join
          (
            select
            a.rejection,
            a.total_finishgood,
            a.feeding,
            a.fg_after_inspect,
            a.lotno,
            (SUM(b.regular_quantity) * 48 + SUM(b.regular_qty_pc)) as jml_prod,
          round((a.feeding / (SUM(b.regular_quantity) * 48 + SUM(b.regular_qty_pc))) * 100, 1)  as level_inspeksi,
          (sum(b.regular_quantity)*48) + SUM(b.hold_produk) + SUM(b.regular_qty_pc) - SUM(b.hold_produk) - a.rejection AS qty_release
          FROM tr_inspection_capa_h a
          left join 6_catatan_hasil_produk_jadi b on a.pro = b.pro
          group by a.pro
          ) e on a.lotno = e.lotno
        left join 6_catatan_hasil_produk_jadi f on b.prod_order = f.pro 
        left join tr_inspeksi_d g on a.id = g.id_head
        left join mst_reasoncode h on g.reason_code = h.reason_code 
        where h.reason_desc = '${reason}'
        and d.produk = '${varian}'
        and b.tgl >= '${startDate}' AND b.tgl <= '${endDate}'
        group by a.lotno
        order by date_format(a.tgl, "%Y-%m-%d") desc
        `);
      } else if (reason && startDate && endDate) {
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
        e.fg_after_inspect,
        e.level_inspeksi,
        e.qty_release,
        h.reason_desc,
        (e.rejection / e.jml_prod ) * 100 as 'defect'
        from tr_inspeksi_h a
        left join mst_prodidentity b on a.lotno = b.lotno 
        left join mst_product c on b.product = c.code_prod 
        left join v_pro_inspeksi d on a.pro_inspeksi = d.pro 
        left join
          (
            select
            a.rejection,
            a.total_finishgood,
            a.feeding,
            a.fg_after_inspect,
            a.lotno,
            (SUM(b.regular_quantity) * 48 + SUM(b.regular_qty_pc)) as jml_prod,
          round((a.feeding / (SUM(b.regular_quantity) * 48 + SUM(b.regular_qty_pc))) * 100, 1)  as level_inspeksi,
          (sum(b.regular_quantity)*48) + SUM(b.hold_produk) + SUM(b.regular_qty_pc) - SUM(b.hold_produk) - a.rejection AS qty_release
          FROM tr_inspection_capa_h a
          left join 6_catatan_hasil_produk_jadi b on a.pro = b.pro
          group by a.pro
          ) e on a.lotno = e.lotno
        left join 6_catatan_hasil_produk_jadi f on b.prod_order = f.pro 
        left join tr_inspeksi_d g on a.id = g.id_head
        left join mst_reasoncode h on g.reason_code = h.reason_code 
        where h.reason_desc = '${reason}'
        and b.tgl >= '${startDate}' AND b.tgl <= '${endDate}'
        group by a.lotno
        order by date_format(a.tgl, "%Y-%m-%d") desc
        `);
      } else if (varian && startDate && endDate) {
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
        e.fg_after_inspect,
        e.level_inspeksi,
        e.qty_release,
        h.reason_desc,
        (e.rejection / e.jml_prod ) * 100 as 'defect'
        from tr_inspeksi_h a
        left join mst_prodidentity b on a.lotno = b.lotno 
        left join mst_product c on b.product = c.code_prod 
        left join v_pro_inspeksi d on a.pro_inspeksi = d.pro 
        left join
          (
            select
            a.rejection,
            a.total_finishgood,
            a.feeding,
            a.fg_after_inspect,
            a.lotno,
            (SUM(b.regular_quantity) * 48 + SUM(b.regular_qty_pc)) as jml_prod,
          round((a.feeding / (SUM(b.regular_quantity) * 48 + SUM(b.regular_qty_pc))) * 100, 1)  as level_inspeksi,
          (sum(b.regular_quantity)*48) + SUM(b.hold_produk) + SUM(b.regular_qty_pc) - SUM(b.hold_produk) - a.rejection AS qty_release
          FROM tr_inspection_capa_h a
          left join 6_catatan_hasil_produk_jadi b on a.pro = b.pro
          group by a.pro
          ) e on a.lotno = e.lotno
        left join 6_catatan_hasil_produk_jadi f on b.prod_order = f.pro 
        left join tr_inspeksi_d g on a.id = g.id_head
        left join mst_reasoncode h on g.reason_code = h.reason_code 
        where d.produk = '${varian}'
        and b.tgl >= '${startDate}' AND b.tgl <= '${endDate}'
        group by a.lotno
        order by date_format(a.tgl, "%Y-%m-%d") desc
        `);
      } else if (startDate && endDate) {
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
        e.fg_after_inspect,
        e.level_inspeksi,
        e.qty_release,
        h.reason_desc,
        (e.rejection / e.jml_prod ) * 100 as 'defect'
        from tr_inspeksi_h a
        left join mst_prodidentity b on a.lotno = b.lotno 
        left join mst_product c on b.product = c.code_prod 
        left join v_pro_inspeksi d on a.pro_inspeksi = d.pro 
        left join
          (
            select
            a.rejection,
            a.total_finishgood,
            a.feeding,
            a.fg_after_inspect,
            a.lotno,
            (SUM(b.regular_quantity) * 48 + SUM(b.regular_qty_pc)) as jml_prod,
          round((a.feeding / (SUM(b.regular_quantity) * 48 + SUM(b.regular_qty_pc))) * 100, 1)  as level_inspeksi,
          (sum(b.regular_quantity)*48) + SUM(b.hold_produk) + SUM(b.regular_qty_pc) - SUM(b.hold_produk) - a.rejection AS qty_release
          FROM tr_inspection_capa_h a
          left join 6_catatan_hasil_produk_jadi b on a.pro = b.pro
          group by a.pro
          ) e on a.lotno = e.lotno
        left join 6_catatan_hasil_produk_jadi f on b.prod_order = f.pro 
        left join tr_inspeksi_d g on a.id = g.id_head
        left join mst_reasoncode h on g.reason_code = h.reason_code 
        where b.tgl >= '${startDate}' AND b.tgl <= '${endDate}'
        group by a.lotno
        order by date_format(a.tgl, "%Y-%m-%d") desc
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
        e.fg_after_inspect,
        e.level_inspeksi,
        e.qty_release,
        h.reason_desc,
        (e.rejection / e.jml_prod ) * 100 as 'defect'
        from tr_inspeksi_h a
        left join mst_prodidentity b on a.lotno = b.lotno 
        left join mst_product c on b.product = c.code_prod 
        left join v_pro_inspeksi d on a.pro_inspeksi = d.pro 
        left join
          (
            select
            a.rejection,
            a.total_finishgood,
            a.feeding,
            a.fg_after_inspect,
            a.lotno,
            (SUM(b.regular_quantity) * 48 + SUM(b.regular_qty_pc)) as jml_prod,
          round((a.feeding / (SUM(b.regular_quantity) * 48 + SUM(b.regular_qty_pc))) * 100, 1)  as level_inspeksi,
          (sum(b.regular_quantity)*48) + SUM(b.hold_produk) + SUM(b.regular_qty_pc) - SUM(b.hold_produk) - a.rejection AS qty_release
          FROM tr_inspection_capa_h a
          left join 6_catatan_hasil_produk_jadi b on a.pro = b.pro
          group by a.pro
          ) e on a.lotno = e.lotno
        left join 6_catatan_hasil_produk_jadi f on b.prod_order = f.pro 
        left join tr_inspeksi_d g on a.id = g.id_head
        left join mst_reasoncode h on g.reason_code = h.reason_code 
        where b.tgl >= CURDATE() - INTERVAL 20 day
        group by a.lotno
        order by date_format(a.tgl, "%Y-%m-%d") desc
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

  getAllReasonFSB: async (req, res) => {
    
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

  getAllProductFSB: async (req, res) => {
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
  },

  getRejectionOCI1: async (req, res) => {
    try {
      let query;
      const { startDate, endDate } = req.body;
      console.log(startDate && endDate);
      if (startDate && endDate) {
        query = await iot_oci1.query(`
        SELECT
        tich.lotno,
        tich.pro,
        tich.product,
        tih.tgl as tgl_inspeksi,
        tih.area_lokasi,
        tih.keterangan,
        fg350.sumfgakhir as fg_350,
        fg900.sumfgakhir as fg_900,
        COALESCE(fg350.sumfgakhir, 0) + COALESCE(fg900.sumfgakhir, 0) AS total_fg,
        tich.feeding as feeding,
        tich.rejection as total_reject,
        tich.fg_after_inspect,
        (COALESCE(COALESCE(fg350.sumfgakhir, 0) + COALESCE(fg900.sumfgakhir, 0), 0) - tich.rejection) as qty_release,
        REPLACE(SUBSTRING(tich.level_inspeksi, 1, CHAR_LENGTH(tich.level_inspeksi) - 1), ',', '.') as level_inspeksi,
        (tich.rejection / COALESCE(fg350.sumfgakhir, 0) + COALESCE(fg900.sumfgakhir, 0) ) * 100 as defect
        from 
        tr_inspection_capa_h tich 
        left join tr_inspeksi_h tih on tich.lotno = tih.lotno 
        left join
          (
            select 
              d.pro,
              SUM(d.sumqty+d.sumsample+d.sumsample10+d.sumsample30+d.sumsample50+d.sumsample100+d.sumhold+d.sumholdmic) AS sumfgakhir
            from (
              SELECT a.pro,
              (SUM(a.reguler_qty)*24) AS sumqty,
              ((SUM(a.sample_produk)*24)+(SUM(a.open_box))) AS sumsample,
              (SUM(a.sample_10)*24) AS sumsample10,
              (SUM(a.sample_30)*24) AS sumsample30,
              (SUM(a.sample_50)*24) AS sumsample50,
              (SUM(a.sample_100)*24) AS sumsample100,
              (SUM(a.hold_produk)*24) AS sumhold,
              (SUM(a.hold_mikro)*24) AS sumholdmic
              FROM 217_catatan_hasil_produk_jadi_350ml a
              group by a.pro
            ) d
            group by d.pro
          ) fg350 on tich.pro = fg350.pro
        left join
          (
            select 
              d.pro,
              SUM(d.sumqty+d.sumsample+d.sumsample10+d.sumsample30+d.sumsample50+d.sumsample100+d.sumhold+d.sumholdmic) AS sumfgakhir
            from (
              SELECT a.pro,
              (SUM(a.reguler_qty)*24) AS sumqty,
              ((SUM(a.sample_produk)*24)+(SUM(a.open_box))) AS sumsample,
              (SUM(a.sample_10)*24) AS sumsample10,
              (SUM(a.sample_30)*24) AS sumsample30,
              (SUM(a.sample_50)*24) AS sumsample50,
              (SUM(a.sample_100)*24) AS sumsample100,
              (SUM(a.hold_produk)*24) AS sumhold,
              (SUM(a.hold_mikro)*24) AS sumholdmic
              FROM 218_catatan_hasil_produk_jadi_900ml a
              group by a.pro
            ) d
            group by d.pro
          ) fg900 on tich.pro = fg900.pro
        WHERE tich.pro LIKE '107%'
        and tih.tgl >= '${startDate}' and tih.tgl <= '${endDate}'
        group by tich.pro
        order by tih.tgl desc
        `);

        res.status(200).send({
          message: "Get data success",
          data: query[0],
        });
      } else {
        query = await iot_oci1.query(`
        SELECT
        tich.lotno,
        tich.pro,
        tich.product,
        tih.tgl as tgl_inspeksi,
        tih.area_lokasi,
        tih.keterangan,
        fg350.sumfgakhir as fg_350,
        fg900.sumfgakhir as fg_900,
        COALESCE(fg350.sumfgakhir, 0) + COALESCE(fg900.sumfgakhir, 0) AS total_fg,
        tich.feeding as feeding,
        tich.rejection as total_reject,
        tich.fg_after_inspect,
        (COALESCE(COALESCE(fg350.sumfgakhir, 0) + COALESCE(fg900.sumfgakhir, 0), 0) - tich.rejection) as qty_release,
        REPLACE(SUBSTRING(tich.level_inspeksi, 1, CHAR_LENGTH(tich.level_inspeksi) - 1), ',', '.') as level_inspeksi,
        (tich.rejection / COALESCE(fg350.sumfgakhir, 0) + COALESCE(fg900.sumfgakhir, 0) ) * 100 as defect
        from 
        tr_inspection_capa_h tich 
        left join tr_inspeksi_h tih on tich.lotno = tih.lotno 
        left join
          (
            select 
              d.pro,
              SUM(d.sumqty+d.sumsample+d.sumsample10+d.sumsample30+d.sumsample50+d.sumsample100+d.sumhold+d.sumholdmic) AS sumfgakhir
            from (
              SELECT a.pro,
              (SUM(a.reguler_qty)*24) AS sumqty,
              ((SUM(a.sample_produk)*24)+(SUM(a.open_box))) AS sumsample,
              (SUM(a.sample_10)*24) AS sumsample10,
              (SUM(a.sample_30)*24) AS sumsample30,
              (SUM(a.sample_50)*24) AS sumsample50,
              (SUM(a.sample_100)*24) AS sumsample100,
              (SUM(a.hold_produk)*24) AS sumhold,
              (SUM(a.hold_mikro)*24) AS sumholdmic
              FROM 217_catatan_hasil_produk_jadi_350ml a
              group by a.pro
            ) d
            group by d.pro
          ) fg350 on tich.pro = fg350.pro
        left join
          (
            select 
              d.pro,
              SUM(d.sumqty+d.sumsample+d.sumsample10+d.sumsample30+d.sumsample50+d.sumsample100+d.sumhold+d.sumholdmic) AS sumfgakhir
            from (
              SELECT a.pro,
              (SUM(a.reguler_qty)*24) AS sumqty,
              ((SUM(a.sample_produk)*24)+(SUM(a.open_box))) AS sumsample,
              (SUM(a.sample_10)*24) AS sumsample10,
              (SUM(a.sample_30)*24) AS sumsample30,
              (SUM(a.sample_50)*24) AS sumsample50,
              (SUM(a.sample_100)*24) AS sumsample100,
              (SUM(a.hold_produk)*24) AS sumhold,
              (SUM(a.hold_mikro)*24) AS sumholdmic
              FROM 218_catatan_hasil_produk_jadi_900ml a
              group by a.pro
            ) d
            group by d.pro
          ) fg900 on tich.pro = fg900.pro
        WHERE tich.pro LIKE '107%'
        and tih.tgl >= curdate() - interval 20 day 
        group by tich.pro
        order by tih.tgl desc
        `);

        res.status(200).send({
          message: "Get data success",
          data: query[0],
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Get data failed",
      });
    }
  },

  getRejectionOCI2: async (req, res) => {
    try {
      let query;
      const { startDate, endDate } = req.body;
      console.log(startDate && endDate);
      if (startDate && endDate) {
        query = await iot_oci1.query(`
        SELECT
        tich.lotno,
        tich.pro,
        tich.product,
        tih.tgl as tgl_inspeksi,
        tih.area_lokasi,
        tih.keterangan,
        fg500.sumfgakhir as total_fg,
        tich.feeding as feeding,
        tich.rejection as total_reject,
        tich.fg_after_inspect,
        (COALESCE(fg500.sumfgakhir, 0) - tich.rejection) as qty_release,	
        REPLACE(SUBSTRING(tich.level_inspeksi, 1, CHAR_LENGTH(tich.level_inspeksi) - 1), ',', '.') as level_inspeksi,
        (tich.rejection / COALESCE(fg500.sumfgakhir, 0)) * 100 as defect
        from 
        tr_inspection_capa_h tich 
        left join tr_inspeksi_h tih on tich.lotno = tih.lotno 
        left join
          (
            select 
              d.pro,
              SUM(d.sumqty+d.sumsample+d.sumsample10+d.sumsample30+d.sumsample50+d.sumsample100+d.sumhold+d.sumholdmic) AS sumfgakhir
            from (
              SELECT a.pro,
              (SUM(a.reguler_qty)*24) AS sumqty,
              ((SUM(a.sample_produk)*24)+(SUM(a.open_box))) AS sumsample,
              (SUM(a.sample_10)*24) AS sumsample10,
              (SUM(a.sample_30)*24) AS sumsample30,
              (SUM(a.sample_50)*24) AS sumsample50,
              (SUM(a.sample_100)*24) AS sumsample100,
              (SUM(a.hold_produk)*24) AS sumhold,
              (SUM(a.hold_mikro)*24) AS sumholdmic
              FROM aio_iot_oci2.216_catatan_hasil_produk_jadi a
              GROUP BY a.pro
            ) d
            group by d.pro
          ) fg500 on tich.pro = fg500.pro
        WHERE tich.pro LIKE '108%'
        and tih.tgl >= '${startDate}' and tih.tgl <= '${endDate}' 
        group by tich.pro
        order by tih.tgl desc
        `);

        res.status(200).send({
          message: "Get data success",
          data: query[0],
        });
      } else {
        query = await iot_oci1.query(`
        SELECT
        tich.lotno,
        tich.pro,
        tich.product,
        tih.tgl as tgl_inspeksi,
        tih.area_lokasi,
        tih.keterangan,
        fg500.sumfgakhir as total_fg,
        tich.feeding as feeding,
        tich.rejection as total_reject,
        tich.fg_after_inspect,
        (COALESCE(fg500.sumfgakhir, 0) - tich.rejection) as qty_release,	
        REPLACE(SUBSTRING(tich.level_inspeksi, 1, CHAR_LENGTH(tich.level_inspeksi) - 1), ',', '.') as level_inspeksi,
        (tich.rejection / COALESCE(fg500.sumfgakhir, 0)) * 100 as defect
        from 
        tr_inspection_capa_h tich 
        left join tr_inspeksi_h tih on tich.lotno = tih.lotno 
        left join
          (
            select 
              d.pro,
              SUM(d.sumqty+d.sumsample+d.sumsample10+d.sumsample30+d.sumsample50+d.sumsample100+d.sumhold+d.sumholdmic) AS sumfgakhir
            from (
              SELECT a.pro,
              (SUM(a.reguler_qty)*24) AS sumqty,
              ((SUM(a.sample_produk)*24)+(SUM(a.open_box))) AS sumsample,
              (SUM(a.sample_10)*24) AS sumsample10,
              (SUM(a.sample_30)*24) AS sumsample30,
              (SUM(a.sample_50)*24) AS sumsample50,
              (SUM(a.sample_100)*24) AS sumsample100,
              (SUM(a.hold_produk)*24) AS sumhold,
              (SUM(a.hold_mikro)*24) AS sumholdmic
              FROM aio_iot_oci2.216_catatan_hasil_produk_jadi a
              GROUP BY a.pro
            ) d
            group by d.pro
          ) fg500 on tich.pro = fg500.pro
        WHERE tich.pro LIKE '108%'
        and tih.tgl >= curdate() - interval 20 day 
        group by tich.pro
        order by tih.tgl desc
        `);

        res.status(200).send({
          message: "Get data success",
          data: query[0],
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Get data failed",
        data: [],
      });
    }
  }
  
};
