var express = require('express');
const { getFlowReleaseOCI1, getFlowReleaseOCI2, getFlowReleaseFSB, grafikRelease } = require('../controllers/flowReleaseController');
var router = express.Router();

router.get('/flow-release-oci1', getFlowReleaseOCI1);
router.get('/flow-release-oci2', getFlowReleaseOCI2);
router.get('/flow-release-fsb', getFlowReleaseFSB);
router.post('/grafik-flow-release', grafikRelease);

module.exports = router;