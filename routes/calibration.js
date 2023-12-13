var express = require('express');
const { count_transaksi_tipe, transksi_by_status, count_transaksi_by_year, count_transaksi_by_month, transaksi_by_category, filter_transksi_month, count_transjenis_monthly, count_transreg_monthly, count_transjenis_yearly, count_transreg_yearly, month_trans, year_trans, getTrans, cetak, table_pending } = require('../controllers/calibrationController');
var router = express.Router();

router.get('/count_transaksi_tipe', count_transaksi_tipe);
router.get('/count_transaksi_by_year', count_transaksi_by_year);
router.post('/count_transaksi_by_month', count_transaksi_by_month);
router.get('/transaksi_by_status', transksi_by_status);
router.get('/transaksi_by_category', transaksi_by_category);
router.get('/table-pending', table_pending);
router.post('/filter_transksi_month', filter_transksi_month);
router.get('/count_transjenis_monthly', count_transjenis_monthly);
router.get('/count_transreg_monthly', count_transreg_monthly);
router.get('/count_transjenis_yearly', count_transjenis_yearly);
router.get('/count_transreg_yearly', count_transreg_yearly);
router.get('/month_trans', month_trans);
router.get('/year_trans', year_trans);
router.get('/getTrans', getTrans);
router.get('/cetak-kalibrasi/:id', cetak);

module.exports = router;