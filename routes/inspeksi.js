var express = require('express');
const { getAllReason, getRejection, getAllProduct } = require('../controllers/inspeksiController');
var router = express.Router();

router.get('/reason', getAllReason);
router.get('/product', getAllProduct);
router.post('/rejection', getRejection);

module.exports = router;