const express = require('express');
const mUserController = require('../controllers/mUserController');

const router = express.Router();

router.post('/create-member', mUserController.createMuser);

router.patch('/update-member', mUserController.updateMuser);

router.patch('/debit-member', mUserController.debitmUser);

router.get('/get-member/:token', mUserController.getMuser);

module.exports = router;
