const { valcalDB } = require('../config/connection');

module.exports = {
      count_transaksi_tipe: async (req, res) => {
        try {
          let query;
          query = await valcalDB.query(
            "SELECT in_or_ex AS jenis, COUNT(in_or_ex) AS in_or_ex FROM trans_kalibrasi GROUP BY in_or_ex",
          );
          res.status(200).json({
            status: 200,
            message: "Success",
            data: query[0],
          });
        } catch (error) {
          console.log(error);
        }
      },
      count_transaksi_by_year: async (req, res) => {
        try {
          let query;
          query = await valcalDB.query(
            `SELECT COUNT(*) AS total_data,
                    DATE_FORMAT(tanggal_calibration, '%Y') AS tahun,
                    DATE_FORMAT(tanggal_calibration, '%Y-%M') AS bulan_tahun,
                    DATE_FORMAT(tanggal_calibration, '%M') AS bulan
             FROM trans_kalibrasi
             WHERE tanggal_calibration IS NOT NULL
             GROUP BY tahun
             ORDER BY tahun DESC;
             `
          );
          res.status(200).json({
            status: 200,
            message: "Success",
            data: query[0],
          });
        } catch (error) {
          console.log(error);
        }
      },
      count_transaksi_by_month: async (req, res) => {
        try {
          let query;
          const { year } = req.body;
          if (year != undefined || year != null) {
            query = await valcalDB.query(
              `SELECT COUNT(*) AS total_data,DATE_FORMAT(tanggal_calibration, '%Y') AS tahun,DATE_FORMAT(tanggal_calibration, '%Y-%M') AS bulan_tahun,DATE_FORMAT(tanggal_calibration, '%M') AS bulan FROM trans_kalibrasi WHERE DATE_FORMAT(tanggal_calibration, '%Y') = ${year} GROUP BY bulan_tahun ORDER BY MONTH(tanggal_calibration) ASC`
            );
          } else if (year == undefined || year == null) {
            query = await valcalDB.query(
              `SELECT COUNT(*) AS total_data,DATE_FORMAT(tanggal_calibration, '%Y') AS tahun,DATE_FORMAT(tanggal_calibration, '%Y-%M') AS bulan_tahun,DATE_FORMAT(tanggal_calibration, '%M') AS bulan FROM trans_kalibrasi WHERE DATE_FORMAT(tanggal_calibration, '%Y') = YEAR(NOW()) GROUP BY bulan_tahun ORDER BY MONTH(tanggal_calibration) ASC`
            );
          }
    
          res.status(200).json({
            status: 200,
            message: "Success",
            data: query[0],
          });
        } catch (error) {
          console.log(error);
        }
      },
      transksi_by_status: async (req, res) => {
        try {
          let query;
          query = await valcalDB.query(
            "SELECT COALESCE(b.hasil, 'Empty') AS status, COUNT(*) AS total FROM trans_kalibrasi a JOIN tr_ver_spv b ON a.id_trans = b.id_pengajuan GROUP BY status"
          );
          res.status(200).json({
            status: 200,
            message: "Success",
            data: query[0],
          });
        } catch (error) {
          console.log(error);
        }
      },
      transaksi_by_category: async (req, res) => {
        try {
          let query;
          query = await valcalDB.query(
            "SELECT b.category, COUNT(*) AS category_count FROM trans_kalibrasi a JOIN mst_category b ON a.category = b.id GROUP BY a.category"
          );
          res.status(200).json({
            status: 200,
            message: "Success",
            data: query[0],
          });
        } catch (error) {
          console.log(error);
        }
      },

      table_pending: async (req, res) => {
        try {
          let query;
          query =
            await valcalDB.query(`SELECT a.id,a.id_trans,a.reg_or_recal,a.in_or_ex,
                a.no_dok,a.equipment_number,a.equipment_name,a.brand,
                a.serial_number,a.location_detail,a.tanggal_calibration,
                a.exp_calibration,a.tanggal_release_certificate,a.requestor,
                a.pic_input,a.model,a.kondisi_alat,a.acceptance_kriteria,a.isactive,
                b.category,c.sub_category,d.departement,e.area,f.sub_area,g.area,h.vendor
                FROM trans_kalibrasi a 
                left JOIN mst_category b ON a.category = b.id
                left JOIN mst_sub_category c ON a.sub_category = c.id
                LEFT JOIN mst_dept d ON a.departement = d.id
                left JOIN mst_area e ON a.area = e.id
                left JOIN mst_sub_area f ON a.sub_area = f.id
                LEFT JOIN mst_sub_detail g ON a.sub_area_detail = g.id
                LEFT JOIN mst_vendor h ON a.vendor_calibration = h.id
                WHERE a.exp_calibration between NOW() and (DATE_ADD(NOW(), INTERVAL 2 MONTH)) 
                AND a.isactive=1`);
          res.status(200).json({
            status: 200,
            message: "Success",
            data: query[0],
          });
        } catch (error) {
          console.log(error);
        }
      },

      filter_transksi_month: async (req, res) => {
        try {
          let query;
          const { month } = req.body;
          if (month != undefined || month != null) {
            query = await valcalDB.query(
              `SELECT b.category, COUNT(*) AS total_data,
                        DATE_FORMAT(tanggal_calibration, '%Y-%M') AS bulan_tahun,
                        DATE_FORMAT(tanggal_calibration, '%c') AS bulan 
                        FROM trans_kalibrasi a
                        JOIN mst_category b ON a.category = b.id
                        WHERE DATE_FORMAT(tanggal_calibration, '%Y') = DATE_FORMAT(NOW(), '%Y')
                        AND DATE_FORMAT(tanggal_calibration, '%c') = ${month}
                        GROUP BY b.category`
            );
          } else {
            query = await valcalDB.query(
              `SELECT b.category, COUNT(*) AS total_data,
                        DATE_FORMAT(tanggal_calibration, '%Y-%M') AS bulan_tahun,
                        DATE_FORMAT(tanggal_calibration, '%c') AS bulan 
                        FROM trans_kalibrasi a
                        JOIN mst_category b ON a.category = b.id
                        WHERE DATE_FORMAT(tanggal_calibration, '%Y') = DATE_FORMAT(NOW(), '%Y')
                        AND DATE_FORMAT(tanggal_calibration, '%c') = DATE_FORMAT(NOW(), '%c')
                        GROUP BY b.category`
            );
          }
          res.status(200).json({
            status: 200,
            message: "Success",
            data: query[0],
          });
        } catch (error) {
          console.log(error);
        }
      },

      count_transjenis_monthly: async (req, res) => {
        try {
          let query;
          query = await valcalDB.query(`SELECT COUNT(*) AS total,
                CASE
                           WHEN in_or_ex = 1 THEN 'Internal'
                           WHEN in_or_ex = 2 THEN 'External'
                       END AS jenis
                FROM trans_kalibrasi
                WHERE tanggal_release_certificate >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND tanggal_release_certificate <= CURDATE()
                GROUP BY in_or_ex`);
          res.status(200).json({
            status: 200,
            message: "Success",
            data: query[0],
          });
        } catch (error) {
          console.log(error);
        }
      },
    
      count_transreg_monthly: async (req, res) => {
        try {
          let query;
          query = await valcalDB.query(`SELECT COUNT(*) AS total,
                CASE
                           WHEN reg_or_recal = 1 THEN 'Registrasi'
                           WHEN reg_or_recal = 2 THEN 'Recalibrasi'
                       END AS jenis
                FROM trans_kalibrasi
                WHERE tanggal_release_certificate >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND tanggal_release_certificate <= CURDATE()
                GROUP BY reg_or_recal`);
          res.status(200).json({
            status: 200,
            message: "Success",
            data: query[0],
          });
        } catch (error) {
          console.log(error);
        }
      },
    
      count_transjenis_yearly: async (req, res) => {
        try {
          let query;
          query = await valcalDB.query(`SELECT COUNT(*) AS total,
                CASE
                           WHEN in_or_ex = 1 THEN 'Registrasi'
                           WHEN in_or_ex = 2 THEN 'Recalibrasi'
                       END AS jenis
                FROM trans_kalibrasi
                WHERE tanggal_release_certificate >= DATE_SUB(CURDATE(), INTERVAL 360 DAY) AND tanggal_release_certificate <= CURDATE()
                GROUP BY in_or_ex`);
          res.status(200).json({
            status: 200,
            message: "Success",
            data: query[0],
          });
        } catch (error) {
          console.log(error);
        }
      },
    
      count_transreg_yearly: async (req, res) => {
        try {
          let query;
          query = await valcalDB.query(`SELECT COUNT(*) AS total,
                CASE
                           WHEN reg_or_recal = 1 THEN 'Registrasi'
                           WHEN reg_or_recal = 2 THEN 'Recalibrasi'
                       END AS jenis
                FROM trans_kalibrasi
                WHERE tanggal_release_certificate >= DATE_SUB(CURDATE(), INTERVAL 360 DAY) AND tanggal_release_certificate <= CURDATE()
                GROUP BY reg_or_recal`);
          res.status(200).json({
            status: 200,
            message: "Success",
            data: query[0],
          });
        } catch (error) {
          console.log(error);
        }
      },
    
      month_trans: async (req, res) => {
        try {
          let in_ex;
          let reg_rec;
          in_ex = await valcalDB.query(
            `SELECT COUNT(*) AS total, 
            CASE in_or_ex
                WHEN 1 THEN 'Internal'
                WHEN 2 THEN 'External'
                WHEN 3 THEN 'Verification'
            END AS jenis
     FROM trans_kalibrasi
     WHERE tanggal_release_certificate >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND tanggal_release_certificate <= CURDATE()
     GROUP BY in_or_ex`
          );
    
          reg_rec = await valcalDB.query(
            `SELECT COUNT(*) AS total, 
            CASE reg_or_recal
                WHEN 1 THEN 'Register'
                WHEN 2 THEN 'Recalibrasi'
            END AS jenis
     FROM trans_kalibrasi
     WHERE tanggal_release_certificate >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) AND tanggal_release_certificate <= CURDATE()
     GROUP BY reg_or_recal`
          );
    
          let graf = [];
          in_ex.forEach((item) => {
            graf.push(item);
          });
    
          reg_rec.forEach((item) => {
            graf.push(item);
          });
    
          res.status(200).json({
            status: 200,
            message: "Success",
            data: graf[0],
          });
        } catch (error) {
          console.log(error);
        }
      },
    
      year_trans: async (req, res) => {
        try {
          let in_ex;
          let reg_rec;
          in_ex = await valcalDB.query(
            `SELECT COUNT(*) AS total, 
            CASE in_or_ex
                WHEN 1 THEN 'Internal'
                WHEN 2 THEN 'External'
                WHEN 3 THEN 'Verification'
            END AS jenis
     FROM trans_kalibrasi
     WHERE tanggal_release_certificate >= DATE_SUB(CURDATE(), INTERVAL 360 DAY) AND tanggal_release_certificate <= CURDATE()
     GROUP BY in_or_ex`
          );
    
          reg_rec = await valcalDB.query(
            `SELECT COUNT(*) AS total, 
            CASE reg_or_recal
                WHEN 1 THEN 'Register'
                WHEN 2 THEN 'Recalibrasi'
            END AS jenis
     FROM trans_kalibrasi
     WHERE tanggal_release_certificate >= DATE_SUB(CURDATE(), INTERVAL 360 DAY) AND tanggal_release_certificate <= CURDATE()
     GROUP BY reg_or_recal`
          );
    
          let graf = [];
          in_ex.forEach((item) => {
            graf.push(item);
          });
    
          reg_rec.forEach((item) => {
            graf.push(item);
          });
    
          res.status(200).json({
            status: 200,
            message: "Success",
            data: graf[0],
          });
        } catch (error) {
          console.log(error);
        }
      },
    
      // get trans_kalibrasi
      getTrans: async (req, res) => {
        try {
          let query;
          query = await valcalDB.query(`
          SELECT a.id,a.id_trans,a.reg_or_recal,a.in_or_ex,
          a.no_dok,a.equipment_number,a.equipment_name,a.brand,
          a.serial_number,a.location_detail,a.tanggal_calibration,
          a.exp_calibration,a.tanggal_release_certificate,a.requestor,
          a.pic_input,a.model,a.kondisi_alat,a.acceptance_kriteria,a.isactive,
          b.category,c.sub_category,d.departement,e.area,f.sub_area,g.area,h.vendor
          FROM trans_kalibrasi a 
          LEFT JOIN mst_category b ON a.category = b.id
          LEFT JOIN mst_sub_category c ON a.sub_category = c.id
          LEFT JOIN mst_dept d ON a.departement = d.id
          LEFT JOIN mst_area e ON a.area = e.id
          LEFT JOIN mst_sub_area f ON a.sub_area = f.id
          LEFT JOIN mst_sub_detail g ON a.sub_area_detail = g.id
          LEFT JOIN mst_vendor h ON a.vendor_calibration = h.id
          WHERE a.isactive=1
          ORDER BY a.id DESC
          `);
          res.status(200).json({
            status: 200,
            message: "Success",
            data: query[0],
          });
        } catch (error) {
          console.log(error);
        }
      },
    
      // cetak
      cetak: async (req, res) => {
        try {
          const { id } = req.params;
          let query;
          query = await valcalDB.query(`
          SELECT a.id,a.id_trans,a.reg_or_recal,a.in_or_ex,
          a.no_dok,a.equipment_number,a.equipment_name,a.brand,
          a.serial_number,a.location_detail,a.tanggal_calibration,
          a.exp_calibration,a.tanggal_release_certificate,a.requestor,
          a.pic_input,a.model,a.kondisi_alat,a.acceptance_kriteria,a.isactive,
          b.category,c.sub_category,d.departement,e.area,f.sub_area,g.area,h.vendor
          FROM trans_kalibrasi a 
          LEFT JOIN mst_category b ON a.category = b.id
          LEFT JOIN mst_sub_category c ON a.sub_category = c.id
          LEFT JOIN mst_dept d ON a.departement = d.id
          LEFT JOIN mst_area e ON a.area = e.id
          LEFT JOIN mst_sub_area f ON a.sub_area = f.id
          LEFT JOIN mst_sub_detail g ON a.sub_area_detail = g.id
          LEFT JOIN mst_vendor h ON a.vendor_calibration = h.id
          WHERE a.isactive=1 AND a.id = ${id}
          `);
          res.status(200).json({
            status: 200,
            message: "Success",
            data: query[0],
          });
        } catch (error) {
          console.log(error);
        }
      }

}