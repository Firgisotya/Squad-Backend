var express = require('express');
const { getBPDOC1Hour, getBPDOC2Hour, getBoundaryOC1, getBoundaryOC2 } = require('../controllers/bpdController');
const { bpdBot } = require('../bot/bpd_bot');
var router = express.Router();

router.get('/bpd-oc1', getBPDOC1Hour);
router.get('/bpd-oc2', getBPDOC2Hour);
router.get('/boundary-oc1', getBoundaryOC1);
router.get('/boundary-oc2', getBoundaryOC2);
router.post("/bot-BPD", bpdBot);

module.exports = router;
