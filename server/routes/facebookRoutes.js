const express = require('express');
const facebookController = require('../controllers/facebookController');

const router = express.Router();

router.post('/', facebookController.createFacebook);

router.patch('/', facebookController.updateFacebook);

router.patch('/update-cookies', facebookController.updateFacebookCookies);

router.patch('/update-messages', facebookController.updateMessages);

module.exports = router;
