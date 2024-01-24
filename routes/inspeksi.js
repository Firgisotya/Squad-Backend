var express = require('express');
const { getAllReasonFSB, getAllProductFSB, getRejectionFSB, getRejectionOCI1, getRejectionOCI2 } = require('../controllers/inspeksiController');
var router = express.Router();

router.get('/reasonFSB', getAllReasonFSB);
router.get('/productFSB', getAllProductFSB);
router.post('/rejectionFSB', getRejectionFSB);
router.post('/rejectionOCI1', getRejectionOCI1);
router.post('/rejectionOCI2', getRejectionOCI2);

module.exports = router;