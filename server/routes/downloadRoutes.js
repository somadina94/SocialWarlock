const express = require('express');
const downloadController = require('../controllers/downloadController');

const router = express.Router();

router.post('/upload-file', downloadController.getFile, downloadController.createSort);

module.exports = router;
